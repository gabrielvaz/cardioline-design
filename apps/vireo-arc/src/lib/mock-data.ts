const patientSeeds = [
  ['John Doe', '15 May 1965', '10 mins ago', 'Active'], ['Jane Smith', '22 Aug 1982', '25 mins ago', 'Active'], ['Robert Johnson', '03 Nov 1950', '1 hour ago', 'Critical'], ['Emily Davis', '14 Feb 1990', '2 hours ago', 'Active'], ['Michael Brown', '30 Sep 1978', 'Yesterday', 'Inactive'],
  ['Sarah Wilson', '12 Jan 1975', 'Yesterday', 'Active'], ['Carlos Almeida', '09 Aug 1982', '2 days ago', 'Active'], ['Andrea Bigazzi', '18 Jun 1969', '2 days ago', 'Active'], ['Gabriel Vaz', '05 Feb 1982', '3 days ago', 'Active'], ['Chiara Mancini', '22 Dec 1991', '3 days ago', 'Active'],
  ['Cristiano Montanari', '13 Mar 1976', '4 days ago', 'Inactive'], ['Junior Delagore', '28 Jul 1985', '5 days ago', 'Active'], ['Larissa Montanari', '11 Apr 1993', '5 days ago', 'Active'], ['Laura Lombardi', '19 Sep 1958', '6 days ago', 'Critical'], ['Gian Mario Dei Rossi', '25 May 1972', '1 week ago', 'Active'],
  ['Domenico Barbieri', '07 Oct 1964', '1 week ago', 'Active'], ['Vincenzo Caruso', '14 Feb 1987', '2 weeks ago', 'Inactive'], ['Giulia Marino', '30 Aug 1979', '2 weeks ago', 'Active'], ['Francesco Grassi', '02 Jan 1957', '3 weeks ago', 'Active'], ['Elena Conti', '29 Nov 1988', '3 weeks ago', 'Active'],
] as const;

export const patients = patientSeeds.map(([name, dob, lastExam, status], index) => ({ id: `P-${10023 + index}`, name, dob, lastExam, status }));

const examTypes = ['Resting ECG', 'Holter 24h', 'Stress Test', 'Resting ECG', 'ECG single lead', 'Holter 48h'] as const;
const results = ['Normal', 'Pending Review', 'Abnormal', 'Normal', 'Normal', 'Borderline'] as const;
const devices = ['ECG100L', 'Walk400h', 'ECG200+', 'ECG100L', 'TouchECG', 'Walk400h'] as const;

export const exams = Array.from({ length: 30 }, (_, index) => {
  const patient = patients[index % 5];
  const day = 24 - Math.floor(index / 4);
  const hour = String(8 + (index % 7)).padStart(2, '0');
  const minute = String((index * 13) % 60).padStart(2, '0');
  return { id: `ECG-${2401 + index}`, patientId: patient.id, name: patient.name, type: examTypes[index % examTypes.length], date: `Oct ${day}, 2026 · ${hour}:${minute} ${index % 2 ? 'AM' : 'PM'}`, device: devices[index % devices.length], result: results[index % results.length] };
});

export const reports = [
  { id: 'R-2401', patient: 'John Doe', patientId: 'P-10023', examId: 'ECG-2401', type: 'Resting ECG Report', date: 'Oct 24, 2026', status: 'Finalized' },
  { id: 'R-2402', patient: 'Jane Smith', patientId: 'P-10024', examId: 'ECG-2402', type: 'Holter 24h Summary', date: 'Oct 24, 2026', status: 'Pending Review' },
  { id: 'R-2403', patient: 'Robert Johnson', patientId: 'P-10025', examId: 'ECG-2403', type: 'Stress Test Findings', date: 'Oct 23, 2026', status: 'Finalized' },
  { id: 'R-2404', patient: 'Emily Davis', patientId: 'P-10026', examId: 'ECG-2404', type: 'Resting ECG Report', date: 'Oct 22, 2026', status: 'Finalized' },
  { id: 'R-2405', patient: 'Michael Brown', patientId: 'P-10027', examId: 'ECG-2405', type: 'ECG Single Lead Report', date: 'Oct 20, 2026', status: 'Finalized' },
  { id: 'R-2406', patient: 'Sarah Wilson', patientId: 'P-10028', examId: 'ECG-2406', type: 'Holter 48h Summary', date: 'Oct 19, 2026', status: 'Draft' },
];
