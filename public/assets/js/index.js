$(document).ready(function () {
  // DOM Variables.
  const initialButton = $(".initialButton");
  const creatingUser = $(".creatingUser");
  const logInUser = $(".logInUser");

  const createUserNameInput = $("#createUserNameInput");
  const logInUserNameInput = $("#logInUserNameInput");
  const createUserSubmit = $("#createUserSubmit");
  const logInUserSubmit = $("#logInUserSubmit");
  const makeLoginForm = $("#makeLoginForm");
  const makeCreateForm = $("#makeCreateForm");
  // Functions.
  function transitionForm(e, input) {
    e.preventDefault();
    if (input === undefined) {
      initialButton.addClass("is-hidden");
      if (this.dataset.type === "create") {
        creatingUser.removeClass("is-hidden");
      } else {
        logInUser.removeClass("is-hidden");
      }
    } else {
      if (input === "login") {
        logInUser.removeClass("is-hidden");
        creatingUser.addClass("is-hidden");
      } else {
        logInUser.addClass("is-hidden");
        creatingUser.removeClass("is-hidden");
      }
    }
  }
  function createUser(e) {
    e.preventDefault();
    const userName = createUserNameInput.val();
    console.log(userName);
    // Do we want to validate here?
    $.post("/api/users", { userName })
      .then(function (result) {
        location.href = "/users/" + userName;
      })
      .catch(function (err) {
        // Error catch here.
      });
  }
  // Event Handlers.
  initialButton.on("click", transitionForm);
  makeLoginForm.on("click", (e) => {
    const input = "login";
    transitionForm(e, input);
  });
  makeCreateForm.on("click", (e) => {
    const input = "create";
    transitionForm(e, input);
  });
  createUserSubmit.on("click", createUser);
});
