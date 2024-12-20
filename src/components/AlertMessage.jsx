export default function AlertMessage({ alertType = "warning", setValue, message = "Welcome to Amazon" }) {
    return (
        <div className={`alert alert-${alertType} alert-dismissible fade show`} role="alert" >
            {message}
            < button type="button" onClick={() => setValue("")} className="btn-close" data-bs-dismiss="alert" aria-label="Close" ></button >
        </div >
    )
}
