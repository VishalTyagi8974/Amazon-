import { useForm } from "react-hook-form"



export default (function Search({ className = "", maxWidth = "570px", style, onSearchSubmit }) {
    const { handleSubmit, register } = useForm()
    return (
        <form action="" onSubmit={handleSubmit(onSearchSubmit)} className={`d-flex w-100 ${className}`} style={{ ...style, marginRight: '1em', maxWidth: maxWidth }}>
            <div className={`input-group d-flex w-md-100 ${className}`}>
                <input
                    className="form-control"
                    type="search"
                    placeholder="Search Amazon"
                    aria-label="Search"
                    style={{ flex: '1' }}
                    {...register("query")}

                />
                <button className="btn btn-outline-secondary" type="submit" style={{ backgroundColor: '#febd69', border: 'none', padding: '5px 10px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                    </svg>
                </button>
            </div>
        </ form>
    )
})