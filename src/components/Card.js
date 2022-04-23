export default function Card(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" :
            props.darkMode ? "#c8c8c8" : "#fff"
    }
    return (
        <div className={`card ${props.darkMode ? "dark" : ""}`} style={styles} onClick={props.holdCards} >
            <h2 className="card-number">{props.value}</h2>
        </div>
    )
}