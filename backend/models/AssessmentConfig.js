import mongoose from 'mongoose';

const AssessmentConfigSchema = new mongoose.Schema(
  {
    course: {
      type: String,
      default: 'ALL'
    },
    subjectType: {
      type: String,
      enum: ['Major', 'Minor'],
      required: true
    },
    icaComponentsCount: {
      type: Number,
      required: true,
      default: function() {
        return this.subjectType === 'Major' ? 3 : 2;
      }
    },
    maxIcaMarks: {
      type: Number,
      default: 25
    },
    icaRule: {
      type: String,
      enum: ['BEST_OF_3', 'MEAN_OF_2'],
      default: function() {
        return this.subjectType === 'Major' ? 'BEST_OF_3' : 'MEAN_OF_2';
      }
    },
    maxPracticalMarks: {
      type: Number,
      default: 50
    },
    maxFinalExamMarks: {
      type: Number,
      default: 75
    },
    passingPercentage: {
      type: Number,
      default: 40
    }
  },
  { timestamps: true }
);

export default mongoose.model('AssessmentConfig', AssessmentConfigSchema);
