import React, { useState, useEffect } from "react";
import WebLayout from "../../../components/WebLayout";
import { Link } from "react-router-dom";

export default function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Sample data - aap yahan API se data fetch karenge
  const sampleCompanies = [
    {
      _id: "68e8b9809e0708edd2030326",
      name: "Segama Ind",
      address: "Nikol Ahemdabad",
      email: "printftechnology22@gmail.com",
      phone: "997812352",
      website: "segama.in",
      logo: null,
      isActive: true,
      type: "PVT LTD",
      employees: 12,
      activeJobs: 5
    },
    {
      _id: "68e8b9809e0708edd2030327",
      name: "Tech Solutions",
      address: "SG Highway, Ahmedabad",
      email: "info@techsolutions.com",
      phone: "9876543210",
      website: "techsolutions.com",
      logo: null,
      isActive: true,
      type: "LTD",
      employees: 25,
      activeJobs: 8
    },
    {
      _id: "68e8b9809e0708edd2030328",
      name: "Innovate Corp",
      address: "Prahlad Nagar, Ahmedabad",
      email: "contact@innovate.com",
      phone: "9876543211",
      website: "innovatecorp.com",
      logo: null,
      isActive: false,
      type: "PVT LTD",
      employees: 8,
      activeJobs: 2
    }
  ];

  useEffect(() => {
    // Yahan aap API call karenge
    setCompanies(sampleCompanies);
  }, []);

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "active" && company.isActive) ||
                         (filterStatus === "inactive" && !company.isActive);
    return matchesSearch && matchesStatus;
  });

  return (
    <WebLayout>
       <section id="services" className="services section">
        {/* Section Title */}
        <div className="container section-title" data-aos="fade-up">
          <h2>Companys</h2>
          <p>
            We offer smart and efficient hiring solutions designed to simplify your recruitment process.
          </p>
        </div>
        {/* End Section Title */}
        <div className="container">
          <div className="row gy-4">
{/* Search and Filter */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-2">
            <select 
              className="form-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
        </div>

        {/* Companies Grid */}
        <div className="row">
          {filteredCompanies.map(company => (
            <div key={company._id} className="col-xl-4 col-md-6 mb-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <div className="d-flex align-items-start mb-3">
                    <div className="flex-shrink-0">
                      <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" 
                           style={{width: '60px', height: '60px'}}>
                        {company.logo ? (
                          <img 
                            src={company.logo} 
                            alt={`${company.name} logo`}
                            className="rounded-circle img-fluid"
                            style={{width: '50px', height: '50px', objectFit: 'cover'}}
                          />
                        ) : (
                          <i className="bi bi-building fs-4 text-muted"></i>
                        )}
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h5 className="card-title mb-1">{company.name}</h5>
                      <p className="text-muted small mb-1">
                        <i className="bi bi-building me-1"></i>
                        {company.type}
                      </p>
                      <span className={`badge ${company.isActive ? 'bg-success' : 'bg-danger'} small`}>
                        {company.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-muted small mb-2">
                      <i className="bi bi-geo-alt me-1"></i>
                      {company.address}
                    </p>
                    <p className="text-muted small mb-2">
                      <i className="bi bi-envelope me-1"></i>
                      {company.email}
                    </p>
                    <p className="text-muted small mb-0">
                      <i className="bi bi-phone me-1"></i>
                      {company.phone}
                    </p>
                  </div>

                  <div className="row text-center mb-3">
                    <div className="col-4">
                      <div className="border-end">
                        <h6 className="text-primary mb-0">{company.employees}</h6>
                        <small className="text-muted">Employees</small>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="border-end">
                        <h6 className="text-success mb-0">{company.activeJobs}</h6>
                        <small className="text-muted">Jobs</small>
                      </div>
                    </div>
                    <div className="col-4">
                      <h6 className="text-info mb-0">24</h6>
                      <small className="text-muted">Apps</small>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCompanies.length === 0 && (
          <div className="text-center py-5">
            <i className="bi bi-building fs-1 text-muted"></i>
            <h4 className="text-muted mt-3">No companies found</h4>
            <p className="text-muted">Try adjusting your search or filters</p>
          </div>
        )}
            </div>
        </div>
      </section>
     
    </WebLayout>
  );
}