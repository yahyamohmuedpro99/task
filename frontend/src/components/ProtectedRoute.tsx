import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AppShell, Box, Group, Button, Title, Text } from '@mantine/core';

export function ProtectedRoute() {
  const { isAuthenticated, user, logout } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
    >
      <Box p="xs" style={{ height: '60px', borderBottom: '1px solid #eee' }}>
        <Group justify="space-between">
          <Title order={3}>HR System</Title>
          <Group>
            <Text>Welcome, {user?.name}</Text>
            <Button variant="light" onClick={logout}>
              Logout
            </Button>
          </Group>
        </Group>
      </Box>
      <Box p="md">
        <Outlet />
      </Box>
    </AppShell>
  );
}

export function PublicRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
