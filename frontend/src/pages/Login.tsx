import { useForm } from '@mantine/form';
import { TextInput, Button, Paper, Title, Container, Alert } from '@mantine/core';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../lib/api';
import { useState } from 'react';
import { IconAlertCircle } from '@tabler/icons-react';

export function Login() {
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
    },
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      setError('');
      setLoading(true);
      const response = await authApi.login(values);
      if (response.access_token && response.employee) {
        login(response.access_token, response.employee);
      } else {
        setError('Invalid response from server');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || 
        'Failed to login. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" order={2} mb={30}>
        HR System Login
      </Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Email"
            placeholder="admin@hr.com"
            required
            {...form.getInputProps('email')}
          />
          <TextInput
            label="Password"
            type="password"
            placeholder="Your password"
            required
            mt="md"
            {...form.getInputProps('password')}
          />

          {error && (
            <Alert 
              icon={<IconAlertCircle size={16} />} 
              title="Error" 
              color="red" 
              mt="md"
            >
              {error}
            </Alert>
          )}

          <Button 
            fullWidth 
            mt="xl" 
            type="submit"
            loading={loading}
          >
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
