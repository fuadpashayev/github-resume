export default function ProgressBar (props){
    return (
        <div className="progress">
            <div className="progress-title">
                {props.label} ({props.value}%)
            </div>
            <div className="progress-area">
                <div
                    className="progress-bar"
                    role="progressbar"
                    aria-valuenow={props.value}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    style={{width: `${props.value}%`}}
                ></div>
            </div>
        </div>
    );
}