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
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { DateInput } from '@mantine/dates';
import { employeeApi } from '../lib/api';
import { Employee, EmployeeGroup, CreateEmployeeData, CreateAttendanceData } from '../types';

export function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [newEmployeeOpened, { open: openNewEmployee, close: closeNewEmployee }] = useDisclosure(false);
  const [attendanceOpened, { open: openAttendance, close: closeAttendance }] = useDisclosure(false);
  const [error, setError] = useState('');

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
    try {
      const data = await employeeApi.getAll();
      setEmployees(data);
    } catch (err) {
      setError('Failed to load employees');
    }
  };

  const handleCreateEmployee = async (values: CreateEmployeeData) => {
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
    try {
      await employeeApi.createAttendance(values);
      closeAttendance();
      attendanceForm.reset();
    } catch (err) {
      setError('Failed to create attendance');
    }
  };

  const handleAttendanceClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    attendanceForm.setValues({
      employeeId: employee.id,
      date: new Date(),
    });
    openAttendance();
  };

  return (
    <Stack>
      <Group justify="space-between">
        <Text size="xl" fw={700}>
          Employees
        </Text>
        <Button onClick={openNewEmployee}>Add Employee</Button>
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
            <Table.Tr key={employee.id}>
              <Table.Td>{employee.name}</Table.Td>
              <Table.Td>{employee.email}</Table.Td>
              <Table.Td>{employee.group}</Table.Td>
              <Table.Td>
                <Button
                  variant="light"
                  size="xs"
                  onClick={() => handleAttendanceClick(employee)}
                >
                  Add Attendance
                </Button>
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
    </Stack>
  );
}
