import React from 'react'

const DeleteAccountPolicies = () => {
    return (
        <section className="herosection pb-5">
            <div className="container">
                <div className="row">
                    <div className="col-12 ">
                        <div className="card shadow-sm rounded-3 my-5">
                            <div className="card-body p-4">
                                <h2 className="text-center mb-4 font20 text-black">
                                    Delete Account Policies
                                </h2>
                                <div className="terms-content">
                                    <div className="mb-5">
                                        <div className="text-muted">
                                            <p>
                                                <strong style={{backgroundColor: 'transparent', color: "windowtext"}}>TalentedXpert – Account Deletion Policy</strong>
                                            </p> 
                                            <p>                                              
                                                <strong style={{backgroundColor: 'transparent', color: "windowtext"}}>1. Permanent Deletion</strong>
                                            </p>
                                            <p>
                                                When a user chooses to delete their TalentedXpert account, the action is permanent and cannot be undone. Once the deletion request is confirmed, the account and all associated user data will be removed from the platform.
                                            </p>
                                            <p>                                              
                                                <strong style={{backgroundColor: 'transparent', color: "windowtext"}}>2. Data Removal Scope</strong>
                                            </p>
                                            <p>
                                                Upon deletion, TalentedXpert will remove:
                                            </p>
                                            <ul>
                                                <li>Personal profile information (name, email, country, etc.)</li>
                                                <li>Task history and proposals</li>
                                                <li>Team associations</li>
                                                <li>Messages and communication logs</li>
                                                <li>Ratings and reviews</li>
                                                <li>Portfolio and uploaded files</li>
                                                <li>Payment and transaction records (where legally permissible)</li>
                                            </ul>
                                            <p>
                                                Certain information may be retained in anonymized form for platform security, analytics, fraud prevention, or to comply with legal obligations.
                                            </p>
                                            <p>                                              
                                                <strong style={{backgroundColor: 'transparent', color: "windowtext"}}>3. Pending Actions</strong>
                                            </p>
                                            <p>
                                                Before deleting an account, users must ensure:
                                            </p>
                                            <ul>
                                                <li>No active tasks or open proposals</li>
                                                <li>No unresolved disputes</li>
                                                <li>No pending payments or withdrawals</li>
                                                <li>No team dependencies</li>
                                            </ul>
                                            <p>
                                                If any of the above exist, the system may prevent deletion until they are resolved.
                                            </p>
                                            <p>                                              
                                                <strong style={{backgroundColor: 'transparent', color: "windowtext"}}>4. Third-Party Integrations</strong>
                                            </p>
                                            <p>
                                                Any connected accounts (e.g., Google, LinkedIn, payment gateways) will be disconnected during the deletion process. Users may need to revoke app permissions from those platforms separately.
                                            </p>
                                            <p>                                              
                                                <strong style={{backgroundColor: 'transparent', color: "windowtext"}}>5. Irreversible Consequences</strong>
                                            </p>
                                            <p>
                                                Once the account is permanently deleted:
                                            </p>
                                            <ul>
                                                <li>User will no longer be able to access past tasks or messages.</li>
                                                <li>Username or email may not be recoverable for future use.</li>
                                                <li>All visibility on the platform (ratings, proposals, tasks, profile links) will be removed.</li>
                                            </ul>
                                            <p>                                              
                                                <strong style={{backgroundColor: 'transparent', color: "windowtext"}}>6. How to Delete Your Account</strong>
                                            </p>
                                            <p>
                                                Users can initiate account deletion through:
                                            </p>
                                            <ul>
                                                <li>Dashboard → Profile Settings → Delete Account</li>
                                            </ul>
                                            <p>
                                                A confirmation prompt will appear requiring user consent.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DeleteAccountPolicies