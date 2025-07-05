function CurrentGoal() {
    return (
        <>
            <div className="component-header">
                <strong>Current Goal</strong>
                <br />
                <p hidden></p>
                <button className="award-token">
                    <strong>
                        <img src="./images/medal-emoji.png" alt="Contrast" width="16" height="16" />
                        Award Token
                    </strong>
                </button>
            </div>
        </>
    )
}
export default CurrentGoal; 