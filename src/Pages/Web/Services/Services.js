import React from "react";
import WebLayout from "../../../components/WebLayout";
import { Link } from "react-router-dom";
export default function Services() {
  return (
    <WebLayout>
      {/* Services Section */}
      <section id="services" className="services section">
        {/* Section Title */}
        <div className="container section-title" data-aos="fade-up">
          <h2>Services</h2>
          <p>
            We offer smart and efficient hiring solutions designed to simplify your recruitment process.
          </p>
        </div>
        {/* End Section Title */}
        <div className="container">
          <div className="row gy-4">
            <div
              className="col-xl-3 col-md-6 d-flex"
              data-aos="fade-up"
              data-aos-delay={100}
            >
              <div className="service-item position-relative">
                <i className="bi bi-activity" />
                <h4>
                  <Link className="stretched-link">
                   Job Posting & Management
                  </Link>
                </h4>
                <p>
                  Easily create and manage job openings to attract the right talent quickly
                </p>
              </div>
            </div>
            {/* End Service Item */}
            <div
              className="col-xl-3 col-md-6 d-flex"
              data-aos="fade-up"
              data-aos-delay={200}
            >
              <div className="service-item position-relative">
                <i className="bi bi-bounding-box-circles" />
                <h4>
                  <Link className="stretched-link">
                   Interview Scheduling
                  </Link>
                </h4>
                <p>
                  Schedule and manage interviews effortlessly to streamline your hiring process.
                </p>
              </div>
            </div>
            {/* End Service Item */}
            <div
              className="col-xl-3 col-md-6 d-flex"
              data-aos="fade-up"
              data-aos-delay={300}
            >
              <div className="service-item position-relative">
                <i className="bi bi-calendar4-week" />
                <h4>
                  <Link className="stretched-link">
                    Application Tracking
                  </Link>
                </h4>
                <p>
                  Track every application in one place and make faster, smarter hiring decisions.
                </p>
              </div>
            </div>
            {/* End Service Item */}
            <div
              className="col-xl-3 col-md-6 d-flex"
              data-aos="fade-up"
              data-aos-delay={400}
            >
              <div className="service-item position-relative">
                <i className="bi bi-broadcast" />
                <h4>
                  <Link className="stretched-link">
                    Customizable Hiring Pipeline
                  </Link>
                </h4>
                <p>
                  Customize your hiring pipeline to match your unique recruitment needs and workflow.
                </p>
              </div>
            </div>
            {/* End Service Item */}
          </div>
        </div>
      </section>
      <section id="alt-services" className="alt-services section">
        <div className="container" data-aos="fade-up" data-aos-delay={100}>
          <div className="row gy-4">
            <div className="col-lg-6" data-aos="zoom-in" data-aos-delay={200}>
              <div className="service-item position-relative">
                <div className="img">
                  <img
                    src="Web/img/dashbord.png"
                    className="img-fluid"
                    alt=""
                  />
                </div>
                <div className="details p-0">
                  <Link  className="stretched-link">
                    <h3 className="m-0">Dashboard</h3>
                  </Link>
                </div>
              </div>
            </div>
            {/* End Service Item */}
            <div className="col-lg-6" data-aos="zoom-in" data-aos-delay={300}>
              <div className="service-item position-relative">
                <div className="img">
                  <img
                    src="Web/img/jobListiing.png"
                    className="img-fluid"
                    alt=""
                  />
                </div>
                <div className="details p-0">
                  <a href="service-details.html" className="stretched-link">
                    <h3 className="m-0" >Job Listing</h3>
                  </a>
                  
                </div>
              </div>
            </div>
            {/* End Service Item */}
            <div className="col-lg-6" data-aos="zoom-in" data-aos-delay={400}>
              <div className="service-item position-relative">
                <div className="img">
                  <img
                    src="Web/img/offerlettrs.png"
                    className="img-fluid"
                    alt=""
                  />
                </div>
                <div className="details p-0">
                  <a href="service-details.html" className="stretched-link">
                    <h3 className="m-0">Offer Letter</h3>
                  </a>
                 
                </div>
              </div>
            </div>
            {/* End Service Item */}
            <div className="col-lg-6" data-aos="zoom-in" data-aos-delay={500}>
              <div className="service-item position-relative">
                <div className="img">
                  <img
                    src="Web/img/profailcomany.png"
                    className="img-fluid"
                    alt=""
                  />
                </div>
                <div className="details p-0">
                  <a href="service-details.html" className="stretched-link">
                    <h3 className="m-0">Company Profile</h3>
                  </a>
                  
                  <a href="service-details.html" className="stretched-link" />
                </div>
              </div>
            </div>
            {/* End Service Item */}
          </div>
        </div>
      </section>
    </WebLayout>
  );
}
