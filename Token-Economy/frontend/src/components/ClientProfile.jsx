import { useState } from "react";

function ClientProfile() {

    // State to manage form
    const [showForm, setShowForm] = useState(false);

    // State to manage clients name
    const [clientName, setClientName] = useState('');

    // State to manage clients gender
    const [clientGender, setClientGender] = useState('');

    // State to manage clients age
    const [clientAge, setClientAge] = useState('');

    // State to manage saved profile info
    const [profile, setProfile] = useState([]);

    // Function to handle submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Save profile information
        const newProfile = {
            name: clientName,
            gender: clientGender,
            age: clientAge
        };

        // Add new client to array of clients
        setProfile([...profile, newProfile]);

        // Reset input
        setShowForm(false);
        setClientName('');
        setClientGender('');
        setClientAge('');
    };

    // Function to handle emoji based on gender 
    const getGenderEmoji = (gender) => {
        switch (gender) {
            case 'male':
                return '👦';
            case 'female':
                return '👧';
            default:
                return '👤';
        }
    };

    return (
        <>
            <div className="component-header client-profile-container">
                <strong>Select Client Profile</strong>

                {showForm && (
                    <form className="profile-form" onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
                        <label>
                            Name:
                            <input
                                type="text"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                required
                                placeholder="Enter name"
                            />
                        </label>

                        <label>
                            Age:
                            <input
                                type="number"
                                value={clientAge}
                                onChange={(e) => setClientAge(e.target.value)}
                                required
                                placeholder="Enter age"
                                min="0"
                            />
                        </label>

                        <label>
                            Gender:
                            <select
                                value={clientGender}
                                onChange={(e) => setClientGender(e.target.value)}
                                required
                            >
                                <option value="" disabled>
                                    Select gender
                                </option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </label>

                        <div className="form-buttons">
                            <button type="submit">Save Profile</button>
                            <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                        </div>
                    </form>
                )}

                <div className="profiles-list">
                    {profile.length > 0 && profile.map((p, i) => (
                        <div key={i} className="profile-card">
                            <div className="profile-emoji">{getGenderEmoji(p.gender)}</div>
                            <div className="profile-info">
                                <h3>{p.name}</h3>
                            </div>
                            <button
                                className="remove-btn"
                                onClick={() => {
                                    setProfile(profile.filter((_, idx) => idx !== i));
                                }}
                                aria-label={`Remove profile ${p.name}`}
                            >X
                            </button>
                        </div>
                    ))}
                </div>

                {!showForm && (
                    <button className="btn add-client-btn" onClick={() => setShowForm(true)}>
                        ✚ Add New
                    </button>
                )}
            </div>
        </>
    );
};
export default ClientProfile;   