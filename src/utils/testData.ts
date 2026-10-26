export interface EmployeeData {
  firstName: string;
  middleName: string;
  lastName: string;
  employeeId: string;
}

/** Builds unique employee data so repeated runs against the shared demo never collide. */
export function generateEmployee(overrides: Partial<EmployeeData> = {}): EmployeeData {
  const stamp = Date.now().toString();
  return {
    firstName: `Auto${stamp.slice(-5)}`,
    middleName: 'Test',
    lastName: `User${stamp.slice(-4)}`,
    employeeId: stamp.slice(-8),
    ...overrides
  };
}
