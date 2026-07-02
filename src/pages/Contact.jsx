function Contact() {
  return (
    <section className="contact-page">
      <div className="products-header">
        <p className="section-badge">Get in Touch</p>

        <h1>Contact Us</h1>

        <p className="section-subtitle">
          We'd love to hear from you. Our team is here to help.
        </p>
      </div>

      <div className="contact-layout">
        <div className="contact-info-card">
          <h2>Contact Information</h2>

          <div className="contact-item">
            <span>📧</span>
            <div>
              <h4>Email</h4>
              <p>support@myshop.com</p>
            </div>
          </div>

          <div className="contact-item">
            <span>📞</span>
            <div>
              <h4>Phone</h4>
              <p>+66 123 456 789</p>
            </div>
          </div>

          <div className="contact-item">
            <span>📍</span>
            <div>
              <h4>Address</h4>
              <p>Bangkok, Thailand</p>
            </div>
          </div>

          <div className="contact-item">
            <span>🕒</span>
            <div>
              <h4>Business Hours</h4>
              <p>Mon - Fri : 9:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>

        <div className="contact-form-card">
          <h2>Send us a Message</h2>

          <form className="contact-form">
            <input
              type="text"
              placeholder="Your Name"
            />

            <input
              type="email"
              placeholder="Your Email"
            />

            <textarea
              rows="6"
              placeholder="Your Message"
            ></textarea>

            <button type="submit">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact