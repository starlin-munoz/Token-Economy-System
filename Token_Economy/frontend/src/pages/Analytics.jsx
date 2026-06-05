import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import AppHeader from '../components/AppHeader';
import { api } from '../api';

function Analytics() {
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [clientStats, setClientStats] = useState(null);
    const [overview, setOverview] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Load clients and overview stats on mount
    useEffect(() => {
        const loadData = async () => {
            const [clientResult, overviewResult] = await Promise.all([
                api.getClients(),
                api.getOverviewAnalytics(),
            ]);

            if (clientResult.error) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }

            setClients(clientResult);
            setOverview(overviewResult);
            setLoading(false);
        };

        loadData();
    }, []);

    // Load client specific analytics when a client is selected
    useEffect(() => {
        if (!selectedClient) {
            setClientStats(null);
            return;
        }

        const loadClientStats = async () => {
            const result = await api.getClientAnalytics(selectedClient);
            if (!result.error) {
                setClientStats(result);
            }
        };

        loadClientStats();
    }, [selectedClient]);

    // Function to handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Format date for chart display
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    };

    // Prepare chart data from sessions
    const chartData = clientStats?.tokensPerSession.map((s, i) => ({
        session: `S${i + 1}`,
        date: formatDate(s.created_at),
        earned: parseInt(s.tokens_earned),
        goal: parseInt(s.goal_tokens),
    })) || [];

    if (loading) {
        return (
            <div>
                <div className="analytics-wrapper">
                    <AppHeader onLogout={handleLogout} />
                    <div className="analytics-loading">Loading analytics...</div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="analytics-wrapper">
                <AppHeader onLogout={handleLogout} />

                {/* Overview cards */}
                <div className="analytics-section">
                    <h2 className="analytics-title">Overview</h2>
                    <div className="overview-cards">
                        <div className="overview-card">
                            <div className="overview-card-value">{overview?.totalClients}</div>
                            <div className="overview-card-label">Total Clients</div>
                        </div>
                        <div className="overview-card">
                            <div className="overview-card-value">{overview?.totalSessions}</div>
                            <div className="overview-card-label">Total Sessions</div>
                        </div>
                        <div className="overview-card">
                            <div className="overview-card-value">{overview?.totalTokens}</div>
                            <div className="overview-card-label">Tokens Awarded</div>
                        </div>
                        <div className="overview-card">
                            <div className="overview-card-value">{overview?.mostActiveClient}</div>
                            <div className="overview-card-label">Most Active Client</div>
                        </div>
                    </div>
                </div>

                {/* Client selector */}
                <div className="analytics-section">
                    <h2 className="analytics-title">Client Analytics</h2>
                    <div className="client-selector">
                        {clients.map(c => (
                            <button
                                key={c.id}
                                className={`client-selector-btn ${selectedClient === c.id ? 'active' : ''}`}
                                onClick={() => setSelectedClient(selectedClient === c.id ? null : c.id)}
                            >
                                {c.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Client stats */}
                {clientStats && (
                    <>
                        {/* Stat cards */}
                        <div className="analytics-section">
                            <div className="overview-cards">
                                <div className="overview-card">
                                    <div className="overview-card-value">{clientStats.totalSessions}</div>
                                    <div className="overview-card-label">Total Sessions</div>
                                </div>
                                <div className="overview-card">
                                    <div className="overview-card-value">{clientStats.completedSessions}</div>
                                    <div className="overview-card-label">Goals Completed</div>
                                </div>
                                <div className="overview-card">
                                    <div className="overview-card-value">{clientStats.totalTokens}</div>
                                    <div className="overview-card-label">Total Tokens</div>
                                </div>
                                <div className="overview-card">
                                    <div className="overview-card-value">{clientStats.averageTokensPerSession}</div>
                                    <div className="overview-card-label">Avg Tokens/Session</div>
                                </div>
                                <div className="overview-card">
                                    <div className="overview-card-value" style={{ fontSize: '2rem' }}>{clientStats.topEmoji}</div>
                                    <div className="overview-card-label">Favourite Token</div>
                                </div>
                            </div>
                        </div>

                        {/* Tokens per session line chart */}
                        {chartData.length > 0 && (
                            <div className="analytics-section">
                                <h3 className="analytics-subtitle">Tokens Earned Per Session</h3>
                                <div className="chart-container">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(124, 77, 255, 0.15)" />
                                            <XAxis dataKey="session" fontFamily="Nunito, sans-serif" fontSize={12} />
                                            <YAxis fontFamily="Nunito, sans-serif" fontSize={12} />
                                            <Tooltip
                                                contentStyle={{
                                                    borderRadius: '1rem',
                                                    border: '2px solid #d0b8ff',
                                                    fontFamily: 'Nunito, sans-serif',
                                                }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="earned"
                                                stroke="#7c4dff"
                                                strokeWidth={3}
                                                dot={{ fill: '#7c4dff', r: 5 }}
                                                name="Tokens Earned"
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="goal"
                                                stroke="#f06292"
                                                strokeWidth={2}
                                                strokeDasharray="5 5"
                                                dot={false}
                                                name="Goal"
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}

                        {/* Tokens per session bar chart */}
                        {chartData.length > 0 && (
                            <div className="analytics-section">
                                <h3 className="analytics-subtitle">Session Progress Overview</h3>
                                <div className="chart-container">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(124, 77, 255, 0.15)" />
                                            <XAxis dataKey="session" fontFamily="Nunito, sans-serif" fontSize={12} />
                                            <YAxis fontFamily="Nunito, sans-serif" fontSize={12} />
                                            <Tooltip
                                                contentStyle={{
                                                    borderRadius: '1rem',
                                                    border: '2px solid #d0b8ff',
                                                    fontFamily: 'Nunito, sans-serif',
                                                }}
                                            />
                                            <Bar dataKey="earned" fill="#7c4dff" radius={[8, 8, 0, 0]} name="Tokens Earned" />
                                            <Bar dataKey="goal" fill="#f9a825" radius={[8, 8, 0, 0]} name="Goal" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}

                        {/* Redemption history */}
                        {clientStats.redemptions.length > 0 && (
                            <div className="analytics-section">
                                <h3 className="analytics-subtitle">Reward Redemption History</h3>
                                <div className="redemption-list">
                                    {clientStats.redemptions.map((r, i) => (
                                        <div key={i} className="redemption-item">
                                            <span className="redemption-name">{r.name}</span>
                                            <span className="redemption-cost">{r.cost} 🪙</span>
                                            <span className="redemption-date">
                                                {new Date(r.redeemed_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Empty state */}
                {clients.length === 0 && (
                    <div className="analytics-empty">
                        No clients yet. Add clients in the Token Economy tab to see analytics.
                    </div>
                )}
            </div>
        </div>
    );
}

export default Analytics;