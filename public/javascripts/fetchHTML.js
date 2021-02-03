fetch("./panel.html")
  .then((response) => {
    return response.text();
  })
  .then((data) => {
    document.querySelector(".panel").innerHTML = data;
  });
// Model Tabs
fetch("./tabs/imageSource.html")
  .then((response) => {
    return response.text();
  })
  .then((data) => {
    document.querySelector(".imageSource").innerHTML = data;
  });
fetch("./tabs/text.html")
  .then((response) => {
    return response.text();
  })
  .then((data) => {
    document.querySelector(".text").innerHTML = data;
  });
fetch("./tabs/alignment.html")
  .then((response) => {
    return response.text();
  })
  .then((data) => {
    document.querySelector(".alignment").innerHTML = data;
  });
fetch("./tabs/hyperlink.html")
  .then((response) => {
    return response.text();
  })
  .then((data) => {
    document.querySelector(".hyperlink").innerHTML = data;
  });
fetch("./tabs/background.html")
  .then((response) => {
    return response.text();
  })
  .then((data) => {
    document.querySelector(".background").innerHTML = data;
  });
fetch("./tabs/visibility.html")
  .then((response) => {
    return response.text();
  })
  .then((data) => {
    document.querySelector(".visibility").innerHTML = data;
  });

fetch("./tabs/size.html")
  .then((response) => {
    return response.text();
  })
  .then((data) => {
    document.querySelector(".size").innerHTML = data;
  });

fetch("./tabs/border.html")
  .then((response) => {
    return response.text();
  })
  .then((data) => {
    document.querySelector(".borderDiv").innerHTML = data;
  });

fetch("./tabs/padding.html")
  .then((response) => {
    return response.text();
  })
  .then((data) => {
    document.querySelector(".paddingDiv").innerHTML = data;
  });
