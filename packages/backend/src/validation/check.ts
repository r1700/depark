// validation.js

const validateLoginData = (email:string, password:string) => {
  if (!email || !password) {
    throw new Error("Both email and password are required");
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    throw new Error("Invalid email format");
  }
};

export { validateLoginData };
