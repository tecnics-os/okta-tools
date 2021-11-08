export const CustomInputAndLabel = ((props) => {
    const validateOnBlur = () => {
        if(props.errorDivId !== undefined) {
            const value = document.getElementById(props.inputId).value;
            if(value === null || value === "") {
                document.getElementById(props.errorDivId).innerHTML = "This field is required";
            }
            else {
                document.getElementById(props.errorDivId).innerHTML = "";
            }
        }
    }
    return (
        <>
            <div className={props.divClassName}>
                <label for={props.inputId} className="form-label">{props.labelText}</label>
                <input value={props.value} type="text" id={props.inputId} name={props.inputId} className="form-control" placeholder={props.labelText} onChange={props.onChange} onBlur={validateOnBlur} />
            </div>
            <div id={props.errorDivId} className="form-text error-msg"></div>
        </>)
})