export default function ProgressBar (props){
    return (
        <div className="progress progress-field">
            <div
                className="progress-bar bg-default"
                role="progressbar"
                aria-valuenow={props.value}
                aria-valuemin="0"
                aria-valuemax="100"
                style={{width: `${props.value}%`}}
                >
                {props.label} ({props.value}%)
            </div>
        </div>
    );
}