const Bed = require('../models/Bed');
const Admission = require('../models/Admission');

class BedAllocator {
  /**
   * Smart bed allocation algorithm
   * @param {Object} admissionData - Patient admission data
   * @returns {Object} - Allocation result
   */
  static async allocateBed(admissionData) {
    try {
      const { patientCategory, priority, specialRequirements = [], preferredWard } = admissionData;
      
      // Determine bed type based on patient category and priority
      const bedType = this.determineBedType(patientCategory, priority);
      
      // Get available beds of the required type
      let availableBeds = await Bed.getAvailableBedsByType(bedType);
      
      // Filter by preferred ward if specified
      if (preferredWard) {
        availableBeds = availableBeds.filter(bed => bed.ward === preferredWard);
      }
      
      // Apply special requirements filters
      availableBeds = this.applySpecialRequirements(availableBeds, specialRequirements);
      
      if (availableBeds.length === 0) {
        return {
          success: false,
          message: `No available ${bedType} beds found`,
          alternatives: await this.findAlternativeBeds(bedType, preferredWard)
        };
      }
      
      // Apply smart allocation logic
      const selectedBed = this.selectOptimalBed(availableBeds, admissionData);
      
      return {
        success: true,
        bed: selectedBed,
        allocationReason: this.getAllocationReason(selectedBed, admissionData)
      };
      
    } catch (error) {
      throw new Error(`Bed allocation failed: ${error.message}`);
    }
  }

  /**
   * Determine appropriate bed type based on patient category and priority
   */
  static determineBedType(patientCategory, priority) {
    // Emergency cases with high priority get ICU beds
    if (patientCategory === 'Emergency' && priority === 'Critical') {
      return 'ICU';
    }
    
    // Emergency cases get ICU or Private beds
    if (patientCategory === 'Emergency') {
      return priority === 'High' ? 'ICU' : 'Private';
    }
    
    // Scheduled surgeries might need ICU for post-op
    if (patientCategory === 'Scheduled' && priority === 'High') {
      return 'Private';
    }
    
    // Default to General beds for most cases
    return 'General';
  }

  /**
   * Apply special requirements filters to available beds
   */
  static applySpecialRequirements(beds, specialRequirements) {
    if (!specialRequirements || specialRequirements.length === 0) {
      return beds;
    }

    return beds.filter(bed => {
      // Check if bed has required equipment
      const hasRequiredEquipment = specialRequirements.every(requirement => {
        return bed.equipment.some(equipment => 
          equipment.name.toLowerCase().includes(requirement.toLowerCase()) &&
          equipment.status === 'Working'
        );
      });
      
      return hasRequiredEquipment;
    });
  }

  /**
   * Select the optimal bed from available options
   */
  static selectOptimalBed(availableBeds, admissionData) {
    // Sort beds by priority factors
    const sortedBeds = availableBeds.sort((a, b) => {
      // Priority 1: Ward preference (if specified)
      if (admissionData.preferredWard) {
        const aInPreferredWard = a.ward === admissionData.preferredWard;
        const bInPreferredWard = b.ward === admissionData.preferredWard;
        if (aInPreferredWard !== bInPreferredWard) {
          return aInPreferredWard ? -1 : 1;
        }
      }
      
      // Priority 2: Room number (prefer lower numbers)
      const roomComparison = a.roomNumber.localeCompare(b.roomNumber);
      if (roomComparison !== 0) {
        return roomComparison;
      }
      
      // Priority 3: Bed number (prefer lower numbers)
      return a.bedNumber.localeCompare(b.bedNumber);
    });
    
    return sortedBeds[0];
  }

  /**
   * Find alternative bed options when primary allocation fails
   */
  static async findAlternativeBeds(requiredBedType, preferredWard) {
    const alternatives = [];
    
    // Try other bed types
    const allBedTypes = ['ICU', 'General', 'Private'];
    const alternativeTypes = allBedTypes.filter(type => type !== requiredBedType);
    
    for (const bedType of alternativeTypes) {
      let beds = await Bed.getAvailableBedsByType(bedType);
      
      if (preferredWard) {
        beds = beds.filter(bed => bed.ward === preferredWard);
      }
      
      if (beds.length > 0) {
        alternatives.push({
          bedType,
          availableCount: beds.length,
          beds: beds.slice(0, 3) // Show first 3 options
        });
      }
    }
    
    return alternatives;
  }

  /**
   * Get allocation reason for transparency
   */
  static getAllocationReason(selectedBed, admissionData) {
    const reasons = [];
    
    if (admissionData.preferredWard && selectedBed.ward === admissionData.preferredWard) {
      reasons.push('Matches preferred ward');
    }
    
    if (selectedBed.type === 'ICU' && admissionData.priority === 'Critical') {
      reasons.push('ICU bed for critical patient');
    }
    
    if (selectedBed.equipment && selectedBed.equipment.length > 0) {
      reasons.push('Has required equipment');
    }
    
    return reasons.join(', ') || 'Best available option';
  }

  /**
   * Check bed availability for a specific time period
   */
  static async checkBedAvailability(bedId, startDate, endDate) {
    try {
      const bed = await Bed.findOne({ bedId });
      if (!bed) {
        throw new Error('Bed not found');
      }
      
      // Check if bed is currently available
      if (bed.status !== 'Available') {
        return {
          available: false,
          reason: `Bed is currently ${bed.status.toLowerCase()}`
        };
      }
      
      // Check for overlapping admissions
      const overlappingAdmissions = await Admission.find({
        bedId,
        status: 'Active',
        $or: [
          {
            admissionDate: { $lte: endDate },
            expectedDischargeDate: { $gte: startDate }
          },
          {
            admissionDate: { $lte: endDate },
            expectedDischargeDate: { $exists: false }
          }
        ]
      });
      
      if (overlappingAdmissions.length > 0) {
        return {
          available: false,
          reason: 'Bed has overlapping admissions',
          conflictingAdmissions: overlappingAdmissions.map(adm => ({
            admissionId: adm.admissionId,
            patientName: adm.patientName,
            admissionDate: adm.admissionDate,
            expectedDischargeDate: adm.expectedDischargeDate
          }))
        };
      }
      
      return {
        available: true,
        bed: {
          bedId: bed.bedId,
          ward: bed.ward,
          roomNumber: bed.roomNumber,
          bedNumber: bed.bedNumber,
          type: bed.type
        }
      };
      
    } catch (error) {
      throw new Error(`Availability check failed: ${error.message}`);
    }
  }

  /**
   * Get bed utilization statistics
   */
  static async getBedUtilizationStats(ward = null) {
    try {
      const filter = ward ? { ward } : {};
      
      const totalBeds = await Bed.countDocuments({ ...filter, isActive: true });
      const occupiedBeds = await Bed.countDocuments({ 
        ...filter, 
        status: 'Occupied',
        isActive: true 
      });
      const availableBeds = await Bed.countDocuments({ 
        ...filter, 
        status: 'Available',
        isActive: true 
      });
      const maintenanceBeds = await Bed.countDocuments({ 
        ...filter, 
        status: 'Maintenance',
        isActive: true 
      });
      const cleaningBeds = await Bed.countDocuments({ 
        ...filter, 
        status: 'Cleaning',
        isActive: true 
      });
      
      const utilizationRate = totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0;
      
      return {
        totalBeds,
        occupiedBeds,
        availableBeds,
        maintenanceBeds,
        cleaningBeds,
        utilizationRate: Math.round(utilizationRate * 100) / 100
      };
      
    } catch (error) {
      throw new Error(`Utilization stats failed: ${error.message}`);
    }
  }

  /**
   * Predict bed availability for the next N days
   */
  static async predictBedAvailability(days = 7, ward = null) {
    try {
      const predictions = [];
      const today = new Date();
      
      for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        date.setHours(0, 0, 0, 0);
        
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        
        // Get expected discharges for this day
        const expectedDischarges = await Admission.find({
          status: 'Active',
          expectedDischargeDate: {
            $gte: date,
            $lt: nextDay
          },
          ...(ward && { ward })
        });
        
        // Get current stats
        const stats = await this.getBedUtilizationStats(ward);
        
        predictions.push({
          date: date.toISOString().split('T')[0],
          expectedDischarges: expectedDischarges.length,
          predictedAvailableBeds: stats.availableBeds + expectedDischarges.length,
          predictedUtilizationRate: Math.round(
            ((stats.occupiedBeds - expectedDischarges.length) / stats.totalBeds) * 100 * 100
          ) / 100
        });
      }
      
      return predictions;
      
    } catch (error) {
      throw new Error(`Prediction failed: ${error.message}`);
    }
  }
}

module.exports = BedAllocator;
