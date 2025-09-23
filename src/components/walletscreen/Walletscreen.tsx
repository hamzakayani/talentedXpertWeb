import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

const Walletscreen = () => {
  return (
    <div>
      {/* Balance Cards */}
      <div className="card text-white p-4 mb-4" style={{ borderRadius: '12px', backgroundColor: '#333333' }}>
        <div className="d-flex gap-4">
          {/* Stripe Balance Card */}
          <div className="flex-fill">
            <h6 className="text-white mb-2 fw-normal">Stripe Balance</h6>
            <h3 className="text-white mb-0 fw-bold">$0</h3>
          </div>
          
          {/* Vertical Separator */}
          <div style={{ width: '1px', backgroundColor: '#3d4653', margin: '0 16px' }}></div>
          
          {/* Wallet Balance Card */}
          <div className="flex-fill">
            <h6 className="text-white mb-3 fw-normal">Wallet Balance</h6>
            
            {/* Balance Row */}
            <div className="d-flex align-items-center mb-3">
              <div className="flex-fill">
                <span className="text-white">Available Balance: $126</span>
              </div>
              <div style={{ width: '1px', height: '20px', backgroundColor: '#3d4653', margin: '0 16px' }}></div>
              <div className="flex-fill">
                <span className="text-white">Escrow Balance: $1192</span>
              </div>
            </div>
            
            {/* Horizontal Separator */}
            <div style={{ height: '1px', backgroundColor: '#3d4653', margin: '16px 0' }}></div>
            
            {/* Action Buttons */}
            <div className="d-flex gap-2">
              <button 
                className="btn d-flex align-items-center gap-2 px-3 py-2 text-white border-0" 
                style={{ 
                  background: 'linear-gradient(135deg, #00BBFF, #5947FF)', 
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                <Icon icon="material-symbols:download" width={16} />
                Deposit
              </button>
              <button 
                className="btn d-flex align-items-center gap-2 px-3 py-2 text-white border" 
                style={{ 
                  backgroundColor: 'transparent', 
                  borderColor: '#3d4653',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                <Icon icon="material-symbols:upload" width={16} />
                Withdraw
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Transaction History Section */}
      <div className="card bg-dark text-white">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Transaction History</h5>
          <div className="d-flex gap-2">
            <div className="input-group" style={{ width: '200px' }}>
              <input 
                type="text" 
                className="form-control form-control-sm bg-dark text-white border-secondary" 
                placeholder="Search"
              />
              <button className="btn btn-outline-secondary btn-sm" type="button">
                <Icon icon="material-symbols:search" width={16} />
              </button>
            </div>
            <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
              <Icon icon="material-symbols:filter-list" width={16} />
              Filter
            </button>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-dark table-hover mb-0">
            <thead style={{ backgroundColor: '#2a2f36' }}>
              <tr>
                <th scope="col" className="text-white fw-bold">ID</th>
                <th scope="col" className="text-white fw-bold">Paid by</th>
                <th scope="col" className="text-white fw-bold">Paid to</th>
                <th scope="col" className="text-white fw-bold">Details</th>
                <th scope="col" className="text-white fw-bold">Type</th>
                <th scope="col" className="text-white fw-bold">Amount</th>
                <th scope="col" className="text-white fw-bold">Date</th>
                <th scope="col" className="text-white fw-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {[1,2,3,4,5,6,7,8,9,10].map((id) => (
                <tr key={id} style={{ backgroundColor: '#1a1a1a' }}>
                  <td className="text-white">{id}</td>
                  <td className="text-white">Talent r Mobile</td>
                  <td className="text-white">expert lead</td>
                  <td className="text-white">Hello tr from mobile Test 2</td>
                  <td className="text-white">DEBIT</td>
                  <td className="text-white">130</td>
                  <td className="text-white">23-09-2025</td>
                  <td>
                    <span className="badge text-white px-2 py-1" style={{ backgroundColor: '#212529', borderRadius: '4px' }}>
                      Captured
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="card-footer d-flex justify-content-between align-items-center">
          <span className="text-muted">10 of total 213</span>
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-outline-secondary btn-sm">
              <Icon icon="material-symbols:keyboard-arrow-left" width={16} />
            </button>
            <select className="form-select form-select-sm bg-dark text-white border-secondary" style={{ width: '60px' }}>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <button className="btn btn-outline-secondary btn-sm">
              <Icon icon="material-symbols:keyboard-arrow-right" width={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Walletscreen;
