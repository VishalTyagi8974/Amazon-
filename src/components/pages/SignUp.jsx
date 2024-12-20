import { Link, useNavigate } from "react-router-dom";
import Button from "../Button";
import InputField from "../InputField";
import { useState } from "react";
import { signUpUser } from "../../../utils/userFunctions";
import AlertMessage from "../AlertMessage";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { login as storeLogin } from "../../../store/slices/authSlice";
import Spinner from "../Spinner"; // Importing Spinner for loading state

export default function SignUp() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const onSignUpUser = async (data) => {
        setLoading(true);
        try {
            const response = await signUpUser({
                username: data.username,
                password: data.password,
                email: data.email,
                isSeller: data.isSeller,
            });

            if (response.status === 200 && response.token) {
                dispatch(storeLogin());
                navigate("/user");
            } else {
                setError(response.data.message || "Something went wrong!");
            }
        } catch (error) {
            setError("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Spinner />
        )
    }


    return (
        <div className="w-100 p-3">
            <form
                onSubmit={handleSubmit(onSignUpUser)}
                className="w-100 m-auto border p-3 rounded shadow my-5"
                style={{ maxWidth: "500px" }}
            >
                <h2>Sign Up</h2>

                {/* Username Field */}
                <InputField
                    placeholder="Create your Username"
                    label="Username"
                    className="mb-2"
                    {...register("username", { required: "Username is required" })}
                    error={errors.username}
                />

                {/* Email Field */}
                <InputField
                    placeholder="Enter your Email"
                    type="email"
                    label="Email"
                    className="mb-2"
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: "Invalid email address",
                        },
                    })}
                    error={errors.email}
                />

                {/* Password Field */}
                <InputField
                    placeholder="Create Password"
                    type="password"
                    className="mb-2"
                    label="Password"
                    {...register("password", {
                        required: "Password is required",
                        minLength: {
                            value: 4,
                            message: "Password must be at least 4 characters",
                        },
                    })}
                    error={errors.password}
                />

                {/* Toggle Button for Seller Status */}
                <div className="form-check form-switch mb-2">
                    <input
                        {...register("isSeller")}
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="flexSwitchCheckDefault"
                    />
                    <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                        Signing up as a Seller?
                    </label>
                </div>

                {/* Submit Button */}
                <Button type="submit" variant="warning" className="rounded w-100 mb-2" disabled={loading}>
                    "Sign Up"
                </Button>
                <Link to="/login">Already Have an Account? Log In</Link>

                {/* Alert Messages */}
                {error && <AlertMessage alertType="danger" setValue={setError} message={error} />}
            </form>
        </div>
    );
}
