/**
 * Mock API simulating 50K clinical research records.
 * Supports pagination and search filtering.
 */

const TOTAL_RECORDS = 50000;
const DEPARTMENTS = ['Cardiology', 'Oncology', 'Neurology', 'Pediatrics', 'Radiology', 'Pathology'];
const STATUSES = ['Active', 'Completed', 'In Review', 'Pending', 'Archived'];

function generateRecord(id) {
  return {
    id: `REC-${String(id).padStart(6, '0')}`,
    patientCode: `P-${Math.floor(Math.random() * 99999)}`,
    department: DEPARTMENTS[id % DEPARTMENTS.length],
    study: `Study-${Math.floor(id / 100) + 1}`,
    status: STATUSES[id % STATUSES.length],
    enrollDate: new Date(2020, 0, 1 + (id % 1500)).toISOString().split('T')[0],
    dataPoints: Math.floor(Math.random() * 500) + 50,
  };
}

const ALL_RECORDS = Array.from({ length: TOTAL_RECORDS }, (_, i) => generateRecord(i));

export async function fetchRecords(page = 0, pageSize = 50, search = '') {
  await new Promise(r => setTimeout(r, 100 + Math.random() * 200));

  let filtered = ALL_RECORDS;
  if (search) {
    const q = search.toLowerCase();
    filtered = ALL_RECORDS.filter(r =>
      r.id.toLowerCase().includes(q) ||
      r.department.toLowerCase().includes(q) ||
      r.status.toLowerCase().includes(q)
    );
  }

  const start = page * pageSize;
  return {
    records: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page,
    totalPages: Math.ceil(filtered.length / pageSize),
  };
}
