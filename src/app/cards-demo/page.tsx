import React from "react";
import NewCard from "@/components/common/cards/newCard";

const CardsDemoPage: React.FC = () => {
  return (
    <div className="container-fluid py-5" style={{ backgroundColor: '#1a1d23', minHeight: '100vh' }}>
      <div className="container">
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="text-white text-center mb-4">New Card Component Demo</h1>
            <p className="text-muted text-center">3 cards per row - Responsive layout</p>
          </div>
        </div>
        
        {/* Cards Grid - 3 cards per row */}
        <div className="cards-grid">
          <div className="row g-4">
            <div className="col-lg-4 col-md-6 col-12">
              <NewCard />
            </div>
            <div className="col-lg-4 col-md-6 col-12">
              <NewCard />
            </div>
            <div className="col-lg-4 col-md-6 col-12">
              <NewCard />
            </div>
          </div>
          
          {/* Additional row for demonstration */}
          <div className="row g-4 mt-2">
            <div className="col-lg-4 col-md-6 col-12">
              <NewCard />
            </div>
            <div className="col-lg-4 col-md-6 col-12">
              <NewCard />
            </div>
            <div className="col-lg-4 col-md-6 col-12">
              <NewCard />
            </div>
          </div>
          
          {/* Third row for demonstration */}
          <div className="row g-4 mt-2">
            <div className="col-lg-4 col-md-6 col-12">
              <NewCard />
            </div>
            <div className="col-lg-4 col-md-6 col-12">
              <NewCard />
            </div>
            <div className="col-lg-4 col-md-6 col-12">
              <NewCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardsDemoPage;
