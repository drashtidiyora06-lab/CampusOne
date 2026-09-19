/**
 * Reusable utility to dynamically calculate a student's current semester
 * based on academic level, academic year / admission year, and current date.
 *
 * General academic calendar assumption:
 * - Odd Semesters (Sem 1, 3, 5): June / July -> November / December
 * - Even Semesters (Sem 2, 4, 6): December / January -> May
 */

export const getValidSemestersForCourse = (academicLevel = 'UG') => {
  if (academicLevel === 'PG') {
    return [
      { sem: 1, yearLevel: 'Year 1', period: 'Odd' },
      { sem: 2, yearLevel: 'Year 1', period: 'Even' },
      { sem: 3, yearLevel: 'Year 2', period: 'Odd' },
      { sem: 4, yearLevel: 'Year 2', period: 'Even' }
    ];
  }
  return [
    { sem: 1, yearLevel: 'FY', period: 'Odd' },
    { sem: 2, yearLevel: 'FY', period: 'Even' },
    { sem: 3, yearLevel: 'SY', period: 'Odd' },
    { sem: 4, yearLevel: 'SY', period: 'Even' },
    { sem: 5, yearLevel: 'TY', period: 'Odd' },
    { sem: 6, yearLevel: 'TY', period: 'Even' }
  ];
};

export const calculateCurrentSemester = ({
  academicLevel = 'UG',
  yearLevel = 'FY',
  currentDate = new Date()
}) => {
  const month = currentDate.getMonth(); // 0 = Jan, ..., 11 = Dec
  // Odd semester window: June (5) to November (10)
  // Even semester window: December (11) or January (0) to May (4)
  const isOddPeriod = month >= 5 && month <= 10;

  if (academicLevel === 'PG') {
    if (yearLevel === 'Year 1' || yearLevel === '1st Year' || yearLevel === 'FY') {
      return isOddPeriod ? 1 : 2;
    } else {
      return isOddPeriod ? 3 : 4;
    }
  }

  // UG Programs
  if (yearLevel === 'FY' || yearLevel === '1st Year') {
    return isOddPeriod ? 1 : 2;
  } else if (yearLevel === 'SY' || yearLevel === '2nd Year') {
    return isOddPeriod ? 3 : 4;
  } else if (yearLevel === 'TY' || yearLevel === '3rd Year') {
    return isOddPeriod ? 5 : 6;
  }

  return isOddPeriod ? 1 : 2;
};

export const isSemesterHistorical = (targetSem, currentSem) => {
  return Number(targetSem) < Number(currentSem);
};
