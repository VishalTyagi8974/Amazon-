import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../Button";
import axios from "axios";
import conf from "../../../conf/conf";
import formatAddress from "../../../utils/formateAddress";
import { getUserData } from "../../../utils/userFunctions";
import AlertMessage from "../AlertMessage"; // Importing AlertMessage for error handling
import Spinner from "../Spinner"; // Importing Spinner for loading state

export default function AddAddress() {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
    const [addresses, setAddresses] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // Loading state for spinner

    useEffect(() => {
        setLoading(true); // Start loading
        getUserData()
            .then(response => {
                setAddresses(response.userData.addresses);
                setLoading(false); // Stop loading
            })
            .catch(err => {
                console.error(err);
                setLoading(false); // Stop loading
                setError("Failed to load addresses.");
            });
    }, []);

    const onSubmit = async (data) => {
        setError("");
        setLoading(true); // Start loading
        try {
            const { address, pincode } = data;
            const location = await axios.get(`https://api.geoapify.com/v1/geocode/search?postcode=${pincode}&apiKey=${conf.geoApiKey}`);

            if (location.data.features.length === 0) {
                throw new Error("Location Not Found");
            }

            const { features: [{ geometry }] } = location.data;
            const { features: [{ properties }] } = location.data;
            const addressString = formatAddress(address, properties, pincode);
            const newAddress = { location: addressString, geometry };

            await axios.post(`${conf.baseUrl}/user/addresses`, { newAddress }, { withCredentials: true });
            setAddresses([...addresses, newAddress]);
            reset();
            setLoading(false); // Stop loading
        } catch (err) {
            setLoading(false); // Stop loading
            setError(err.message);
        }
    };

    return (
        <div className="d-flex justify-content-center my-5">
            <div className="container card shadow p-4" style={{ maxWidth: "700px" }}>
                <h2 className="text-center mb-4">Add Address</h2>

                {error && <AlertMessage message={error} alertType="danger" />} {/* Show error alert if there's an error */}
                {loading && <Spinner />} {/* Show spinner during data loading */}

                <ul className="list-unstyled mb-4">
                    {addresses.map((add, index) => (
                        <li key={index} className="mb-2 p-3 border rounded">
                            <strong>Address:</strong> {add.location}<br />
                        </li>
                    ))}
                </ul>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <label htmlFor="addressInput" className="form-label">Address</label>
                        <input
                            id="addressInput"
                            type="text"
                            className="form-control"
                            placeholder="Enter your address"
                            {...register("address", { required: "Address is required" })}
                        />
                        {errors.address && <div className="text-danger">{errors.address.message}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="pincodeInput" className="form-label">Pincode</label>
                        <input
                            id="pincodeInput"
                            type="text"
                            className="form-control"
                            placeholder="Enter pincode"
                            {...register("pincode", { required: "Pincode is required" })}
                        />
                        {errors.pincode && <div className="text-danger">{errors.pincode.message}</div>}
                    </div>
                    <Button type="submit" className="btn btn-warning w-100" disabled={isSubmitting || loading}>
                        {isSubmitting ? <i className="bi bi-loader"></i> : <i className="bi bi-plus-lg"></i>}
                        {isSubmitting ? " Adding..." : " Add Address"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
