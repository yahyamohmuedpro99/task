import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Group,
  Text,
  Modal,
  TextInput,
  Select,
  Box,
  Stack,
  Badge,
  Loader,
  ActionIcon,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { DateInput } from '@mantine/dates';
import { IconRefresh } from '@tabler/icons-react';
import { employeeApi } from '../lib/api';
import { Employee, EmployeeGroup, CreateEmployeeData, CreateAttendanceData, Attendance } from '../types';

export function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [newEmployeeOpened, { open: openNewEmployee, close: closeNewEmployee }] = useDisclosure(false);
  const [attendanceOpened, { open: openAttendance, close: closeAttendance }] = useDisclosure(false);
  const [attendanceHistoryOpened, { open: openAttendanceHistory, close: closeAttendanceHistory }] = useDisclosure(false);
  const [selectedAttendances, setSelectedAttendances] = useState<Attendance[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  const newEmployeeForm = useForm<CreateEmployeeData>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      group: EmployeeGroup.NORMAL,
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
      name: (value) => (value.length < 2 ? 'Name must be at least 2 characters' : null),
    },
  });

  const attendanceForm = useForm<CreateAttendanceData>({
    initialValues: {
      employeeId: 0,
      date: new Date(),
    },
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await employeeApi.getAll();
      setEmployees(data);
    } catch (err) {
      setError('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployee = async (values: CreateEmployeeData) => {
    setError('');
    try {
      await employeeApi.create(values);
      closeNewEmployee();
      loadEmployees();
      newEmployeeForm.reset();
    } catch (err) {
      setError('Failed to create employee');
    }
  };

  const handleCreateAttendance = async (values: CreateAttendanceData) => {
    setError('');
    try {
      await employeeApi.createAttendance(values);
      closeAttendance();
      attendanceForm.reset();
      // Refresh attendance history if modal is open
      if (selectedEmployee && attendanceHistoryOpened) {
        await loadAttendanceHistory(selectedEmployee);
      }
    } catch (err) {
      setError('Failed to create attendance');
    }
  };

  const handleAddAttendanceClick = (employee: Employee, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEmployee(employee);
    attendanceForm.setValues({
      employeeId: employee.id,
      date: new Date(),
    });
    openAttendance();
  };

  const loadAttendanceHistory = async (employee: Employee) => {
    setLoadingAttendance(true);
    setError('');
    try {
      const attendances = await employeeApi.getAttendance(employee.id);
      // Sort by date descending
      const sortedAttendances = [...attendances].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setSelectedAttendances(sortedAttendances);
      openAttendanceHistory();
    } catch (err) {
      setError('Failed to load attendance history');
    } finally {
      setLoadingAttendance(false);
    }
  };

  return (
    <Stack>
      <Group justify="space-between">
        <Group>
          <Text size="xl" fw={700}>
            Employees
          </Text>
          {loading && <Loader size="sm" />}
        </Group>
        <Group>
          <ActionIcon 
            variant="light" 
            onClick={loadEmployees}
            loading={loading}
          >
            <IconRefresh size={16} />
          </ActionIcon>
          <Button onClick={openNewEmployee}>Add Employee</Button>
        </Group>
      </Group>

      {error && (
        <Text c="red" size="sm">
          {error}
        </Text>
      )}

      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Group</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {employees.map((employee) => (
            <Table.Tr 
              key={employee.id}
              style={{ cursor: 'pointer' }}
              onClick={() => loadAttendanceHistory(employee)}
            >
              <Table.Td>{employee.name}</Table.Td>
              <Table.Td>{employee.email}</Table.Td>
              <Table.Td>
                <Badge 
                  color={employee.group === EmployeeGroup.HR ? 'blue' : 'gray'}
                >
                  {employee.group}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Group>
                  <Button
                    variant="light"
                    size="xs"
                    onClick={(e) => handleAddAttendanceClick(employee, e)}
                  >
                    Add Attendance
                  </Button>
                  <Button
                    variant="subtle"
                    size="xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      loadAttendanceHistory(employee);
                    }}
                  >
                    View History
                  </Button>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Modal
        opened={newEmployeeOpened}
        onClose={closeNewEmployee}
        title="Add New Employee"
      >
        <Box component="form" onSubmit={newEmployeeForm.onSubmit(handleCreateEmployee)}>
          <TextInput
            label="Name"
            placeholder="Employee name"
            required
            {...newEmployeeForm.getInputProps('name')}
          />
          <TextInput
            label="Email"
            placeholder="employee@company.com"
            required
            mt="md"
            {...newEmployeeForm.getInputProps('email')}
          />
          <TextInput
            label="Password"
            type="password"
            placeholder="Password"
            required
            mt="md"
            {...newEmployeeForm.getInputProps('password')}
          />
          <Select
            label="Group"
            data={Object.values(EmployeeGroup)}
            required
            mt="md"
            {...newEmployeeForm.getInputProps('group')}
          />
          <Button type="submit" fullWidth mt="xl">
            Create Employee
          </Button>
        </Box>
      </Modal>

      <Modal
        opened={attendanceOpened}
        onClose={closeAttendance}
        title={`Add Attendance - ${selectedEmployee?.name}`}
      >
        <Box component="form" onSubmit={attendanceForm.onSubmit(handleCreateAttendance)}>
          <DateInput
            label="Date"
            required
            {...attendanceForm.getInputProps('date')}
          />
          <Button type="submit" fullWidth mt="xl">
            Add Attendance
          </Button>
        </Box>
      </Modal>

      <Modal
        opened={attendanceHistoryOpened}
        onClose={closeAttendanceHistory}
        title={`Attendance History - ${selectedEmployee?.name}`}
        size="lg"
      >
        <Stack>
          <Group justify="flex-end">
            <ActionIcon
              variant="light"
              onClick={() => selectedEmployee && loadAttendanceHistory(selectedEmployee)}
              loading={loadingAttendance}
            >
              <IconRefresh size={16} />
            </ActionIcon>
          </Group>

          {loadingAttendance ? (
            <Box ta="center" py="xl">
              <Loader />
            </Box>
          ) : (
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Date</Table.Th>
                  <Table.Th>Created At</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {selectedAttendances.map((attendance) => (
                  <Table.Tr key={attendance.id}>
                    <Table.Td>{new Date(attendance.date).toLocaleDateString()}</Table.Td>
                    <Table.Td>{new Date(attendance.createdAt).toLocaleString()}</Table.Td>
                  </Table.Tr>
                ))}
                {selectedAttendances.length === 0 && (
                  <Table.Tr>
                    <Table.Td colSpan={2}>
                      <Text ta="center" c="dimmed">
                        No attendance records found
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          )}
        </Stack>
      </Modal>
    </Stack>
  );
}
