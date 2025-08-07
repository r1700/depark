import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Link, Alert, Stack, Container, CircularProgress } from "@mui/material";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import GoogleAuth from "../google-auth/GoogleAuth";

interface IFormInputs {
  email: string;
  password: string;
  
}

const schema = yup
  .object({
    email: yup.string().email("Invalid email format").required("Email is required"),
    password: yup.string().required("Password is required").min(4, "Password must be at least 4 characters"),
  })
  .required();

const LoginScreen: React.FC = () => {
  const [login, setLogin] = useState<boolean>(false); 
  const [serverError, setServerError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (login) {
      const role = JSON.parse(localStorage.getItem("user") || "{}").role;
      if (role === 1) navigate("/layout/hr-dashboard");
      else if (role === 2) navigate("/layout/admin-dashboard");
    }
  }, [login, navigate]);

  const { control, handleSubmit, formState: { errors, isValid } } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    setServerError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      setLoading(false);

      if (!response || result.status === "error") {
        setServerError(result.success || "Login failed");
        return;
      }

      if (result.success === true) {
        setLogin(true); 

        const { user, token, expiresAt } = result;
        console.log(user+ " logged in successfully");
        
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("expiresAt", expiresAt);
      } else {
        setServerError("Unexpected server response");
      }
    } catch (error) {
      setLoading(false);
      setServerError("Network error: " + (error as Error).message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          mt: 8,
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
          textAlign: "center",
          direction: "ltr",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
          Welcome !
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Please login to your account
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ""}
                autoComplete="email"
                autoFocus
                dir="ltr"
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Password"
                variant="outlined"
                fullWidth
                margin="normal"
                type="password"
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ""}
                autoComplete="current-password"
                dir="ltr"
              />
            )}
          />

          {serverError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {serverError}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={!isValid || loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
        </Box>

        <GoogleAuth setLogin={setLogin} />

        <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }} spacing={2}>
          <Link href="#" underline="hover" variant="body2" dir="ltr">
            Forgot password?
          </Link>
          <Link href="#" underline="hover" variant="body2" dir="ltr">
            Sign up for a new account
          </Link>
        </Stack>
      </Box>
    </Container>
  );
};

export default LoginScreen;