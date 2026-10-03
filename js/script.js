"use strict";

document.documentElement.classList.add("js-enabled");

const navigationToggle = document.querySelector(".nav-toggle");
const primaryNavigation = document.querySelector("#primary-navigation");

if (navigationToggle && primaryNavigation) {
  const setNavigationOpen = (isOpen) => {
    navigationToggle.setAttribute("aria-expanded", String(isOpen));
    navigationToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );
  };

  navigationToggle.addEventListener("click", () => {
    const isOpen = navigationToggle.getAttribute("aria-expanded") === "true";
    setNavigationOpen(!isOpen);
  });

  primaryNavigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      setNavigationOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    const isOpen = navigationToggle.getAttribute("aria-expanded") === "true";
    if (event.key === "Escape" && isOpen) {
      setNavigationOpen(false);
      navigationToggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 42.001rem)").matches) {
      setNavigationOpen(false);
    }
  });
}

const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  const nameField = contactForm.querySelector("#contact-name");
  const emailField = contactForm.querySelector("#contact-email");
  const messageField = contactForm.querySelector("#contact-message");
  const formStatus = contactForm.querySelector("#form-status");

  const fieldErrors = [
    { field: nameField, message: "Please enter your name." },
    { field: emailField, message: "Please enter your email address." },
    { field: messageField, message: "Please enter a message." }
  ];

  const setFieldError = (field, message) => {
    const errorMessage = contactForm.querySelector(
      `#${field.getAttribute("aria-describedby")}`
    );

    errorMessage.textContent = message;
    errorMessage.hidden = message.length === 0;

    if (message) {
      field.setAttribute("aria-invalid", "true");
    } else {
      field.removeAttribute("aria-invalid");
    }
  };

  [nameField, emailField, messageField].forEach((field) => {
    field.addEventListener("input", () => {
      formStatus.textContent = "";
      if (field.getAttribute("aria-invalid") === "true") {
        setFieldError(field, "");
      }
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.textContent = "";

    let firstInvalidField = null;

    fieldErrors.forEach(({ field, message }) => {
      const isEmpty = field.value.trim() === "";
      setFieldError(field, isEmpty ? message : "");
      if (isEmpty && !firstInvalidField) {
        firstInvalidField = field;
      }
    });

    const emailIsEmpty = emailField.value.trim() === "";
    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(
      emailField.value.trim()
    );

    if (!emailIsEmpty && !emailIsValid) {
      setFieldError(emailField, "Enter a valid email address, like name@example.com.");
      if (!firstInvalidField) {
        firstInvalidField = emailField;
      }
    }

    if (firstInvalidField) {
      firstInvalidField.focus();
      return;
    }

    formStatus.textContent = "Thanks! Your message is ready. This demo form doesn’t send emails.";
    contactForm.reset();
  });
}
