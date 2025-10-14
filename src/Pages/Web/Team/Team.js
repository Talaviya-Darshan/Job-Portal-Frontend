import React, { useState, useEffect } from "react";
import WebLayout from "../../../components/WebLayout";
import axios from "axios";
export default function Team() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const Env = process.env;
  useEffect(() => {
    fetchTeamMembers();
  }, []);
  const fetchTeamMembers = async () => {
    try {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${Env.REACT_APP_API_URL}team/getAllTeamPublic`,
        headers: {},
      };

      const response = await axios.request(config);
      setTeamMembers(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError("Failed to load team members");
      setLoading(false);
    }
  };
  const SkeletonLoader = () => {
    return (
      <div className="container">
        <div className="row gy-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="col-lg-3 col-md-6 d-flex align-items-stretch"
              data-aos="fade-up"
              data-aos-delay={(index + 1) * 100}
            >
              <div className="team-member">
                <div className="member-img">
                  <div className="skeleton-image img-fluid"></div>
                  <div className="social">
                    {[...Array(4)].map((_, i) => (
                      <a key={i} href="#" className="skeleton-social">
                        <i className="bi bi-circle" />
                      </a>
                    ))}
                  </div>
                </div>
                <div className="member-info">
                  <div className="skeleton-text skeleton-name"></div>
                  <div className="skeleton-text skeleton-role"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  return (
    <div>
      <WebLayout>
        {/* Team Section */}
        <section id="team" className="team section">
          {/* Section Title */}
          <div className="container section-title" data-aos="fade-up">
            <h2>Team</h2>
            <p>
            Meet the dedicated professionals behind TalentOS, committed to transforming the hiring experience.
            </p>
          </div>
          {/* End Section Title */}
          {loading ? (
            <SkeletonLoader />
          ) : error ? (
            <div className="container text-center">
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
              <button
                className="btn btn-primary mt-3"
                onClick={fetchTeamMembers}
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="container">
              <div className="row gy-4">
                {teamMembers.map((member, index) => (
                  <div
                    key={member._id}
                    className="col-lg-3 col-md-6 d-flex align-items-stretch"
                    data-aos="fade-up"
                    data-aos-delay={(index + 1) * 100}
                  >
                    <div className="team-member">
                      <div className="member-img">
                        <img
                          src={member.image}
                          className="img-fluid"
                          alt={member.name}
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/400x400?text=No+Image";
                          }}
                        />
                        <div className="social">
                          <p className="bg-dark p-1 px-5 text-light mb-0 font-weight-900">
                            {member.name}
                          </p>
                        </div>
                      </div>
                      <div className="member-info">
                        <h4>{member.designation}</h4>
                        {member.description && (
                          <p className="mt-2 small text-muted mb-0">
                            {member.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
        {/* /Team Section */}
      </WebLayout>
    </div>
  );
}
