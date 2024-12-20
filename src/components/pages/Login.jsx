import { Link, useNavigate } from "react-router-dom";
import Button from "../Button";
import InputField from "../InputField";
import { useState } from "react";
import { loginUser } from "../../../utils/userFunctions";
import AlertMessage from "../AlertMessage";
import { useForm } from "react-hook-form";
import { login as storeLogin } from "../../../store/slices/authSlice";
import { useDispatch } from "react-redux";
import Spinner from "../Spinner";


export default function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    function loginUserSubmit(data) {
        setError("");
        setLoading(true);
        if (data.username && data.password) {
            loginUser({ username: data.username, password: data.password })
                .then((response) => {
                    if (response.status === 200) {
                        navigate("/user");
                        dispatch(storeLogin());
                    } else {
                        setLoading(false);
                        setError(response.message);
                    }
                })
                .catch((error) => {
                    setLoading(false);
                    setError("Something went Wrong!");
                });
        }
    }

    if (loading) {
        return (
            <Spinner />
        )
    }

    return (

        <div className="w-100 p-3">
            <form onSubmit={handleSubmit(loginUserSubmit)} className="w-100 m-auto border p-3 rounded shadow my-5" style={{ maxWidth: "500px" }}>
                <h2>Log In</h2>

                <InputField
                    placeholder="Enter your Username"
                    label="Username"
                    className="mb-2"
                    {...register("username", { required: "Username is required" })}
                    error={errors.username}
                />

                <InputField
                    placeholder="Enter your Password"
                    type="password"
                    className="mb-2"
                    label="Password"
                    {...register("password", {
                        required: "Password is required",
                        minLength: {
                            value: 4,
                            message: "Password must be at least 4 characters",
                        }
                    })}
                />

                <Button type="submit" variant="warning" className="rounded w-100 mb-2" disabled={loading}>
                    Log In
                </Button>
                <Link to="/signup">Don't have an account? Create Account</Link>
            </form>

            {error && <AlertMessage alertType="danger" setValue={setError} message={error} />}
            {message && <AlertMessage alertType="info" setValue={setMessage} message={message} />}

        </div>

    );
}
