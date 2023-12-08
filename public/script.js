const getStats = async () => {
    try {
        return await (await fetch("/api/stats/")).json();
    } catch (error) {
        console.log(error);
    }
};

const showStats = async () => {
    try {
        let stats = await getStats();
        let statsDiv = document.getElementById("stat-list");
        statsDiv.innerHTML = "";
        stats.forEach((stat) => {
            const section = document.createElement("section");
            section.classList.add("stat");
            statsDiv.append(section);

            const a = document.createElement("a");
            a.href = "#";
            section.append(a);

            const h3 = document.createElement("h1");
            h3.innerHTML = `${stat.first} ${stat.last}`;
            a.append(h3);

            a.onclick = (e) => {
                e.preventDefault();
                displayDetails(stat);
            };
        });
    } catch (error) {
        console.log(error);
    }
};


const displayDetails = (stat) => {
    const statDetails = document.getElementById("stat-details");
    statDetails.innerHTML = "";

    const h3 = document.createElement("h3");
    h3.innerHTML = `${stat.first} ${stat.last}`;
    statDetails.append(h3);

    const deleteLink = document.createElement("a");
    deleteLink.innerHTML = "	&#x2715;";
    statDetails.append(deleteLink);
    deleteLink.id = "delete-link";

    const editLink = document.createElement("a");
    editLink.innerHTML = "&#9998;";
    statDetails.append(editLink);
    editLink.id = "edit-link";

    const p = document.createElement("p");
    statDetails.append(p);
    p.innerHTML = `Total Touchdowns: ${stat.touchdowns} Passing Yards: ${stat.recieving} Rushing Yards: ${stat.recieving} Recieving Yards: ${stat.recieving}`;


    editLink.onclick = (e) => {
        e.preventDefault();
        document.querySelector(".dialog").classList.remove("transparent");
        document.getElementById("add-title").innerHTML = "Edit Player Stats";
    };

    deleteLink.onclick = (e) => {
        e.preventDefault();
        deleteStat(stat);
    };
    
    populateForm(stat);
};

const deleteStat = async (stat) => {
    const confirmation = confirm("Are you sure you want to delete this players stats?");
    
    if (confirmation) {
        try {
            let response = await fetch(`/api/stats/${stat._id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                }
            });

            if (response.status === 200) {
                showStats();
                document.getElementById("stat-details").innerHTML = "";
                resetForm();
            } else {
                console.log("Error deleting stat");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    } else {}
};


const populateForm = (stat) => {
    const form = document.getElementById("add-stat-form");
    form._id.value = stat._id;
    form.first.value = stat.first;
    form.last.value = stat.last;
    form.touchdowns.value = stat.touchdowns;
    form.passing.value = stat.passing;
    form.recieving.value = stat.recieving;
    form.rushing.value = stat.rushing;
};

const addStat = async (e) => {
    e.preventDefault();
    const form = document.getElementById("add-stat-form");
    const formData = new FormData(form);
    let response;
console.log("working1");
    if (form._id.value == -1) {
        formData.delete("_id");
console.log("working2");
     response = await fetch("/api/stats", {
            method: "POST",
            body: formData
     });
    }
    else {
console.log("working3");
       console.log(...formData);
       console.log("ID IS " + form._id.value);
        response = await fetch(`/api/stats/${form._id.value}`, {
            method: "PUT",
             body: formData
       });
console.log("working4");
    }


    if (response.status != 200) {
        console.log("Error posting data");
        alert("Please make sure all boxes are filled and have no negative stats")
    }

    stat = await response.json();

    if (form._id.value != -1) {
        displayDetails(stat);
    }

        resetForm();
        document.querySelector(".dialog").classList.add("transparent");
        showStats();
    
};

const resetForm = () => {
    const form = document.getElementById("add-stat-form");
    form.reset();
    form._id.value = "-1";
};

const showHideAdd = (e) => {
    e.preventDefault();
    document.querySelector(".dialog").classList.remove("transparent");
    document.getElementById("add-title").innerHTML = "Add Player Stats";
    resetForm();
};

const toggleNav = () => {
    document.getElementById("nav-items").classList.toggle("hide-small");
};

window.onload = () => {
    document.getElementById("hamburger").onclick = toggleNav;
    showStats();
    document.getElementById("add-stat-form").onsubmit = addStat;
    document.getElementById("add-link").onclick = showHideAdd;

    document.querySelector(".close").onclick = () => {
    document.querySelector(".dialog").classList.add("transparent");
    };
};

document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".dialog").classList.remove("transparent");
    document.querySelector(".dialog").classList.add("transparent");
});