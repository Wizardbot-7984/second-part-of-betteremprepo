// Wildscore Calculator
// This file takes the information from the HTML form, and then calculates your score and tier based on your responses
 
/* -------------------- 1. The function to calculate your score based on the code below -------------------- */
/* -------------------- The choices and how many points they take away from your score -------------------- */
 
function calculateWildscore(data) {
    let base_score = 850; // Starting score
 
    //What kind of house you live in
    const habitat_negatives = {
        "apartment": 60,
        "suburban": 180,
        "rural": 300,
        "urban": 40
    };
 
    //How you sort your waste
    const waste_negatives = {
        "Everything in recycling": 40,
        "Everything in trash": 30,
        "I sort everything": 50,
        "I put it wherever I want": 20,
        "No": 25
    };
 
    //The frequency of your use in chemicals
    const chemical_negatives = {
        "Frequent": 200,
        "Sometimes": 100,
        "Never": 0
    };
 
    //What kind of transportation you use
    const transport_negatives = {
        "Drive Solo": 150,
        "Mixed Transport": 75,
        "Bike/Walk": 25,
        "Mostly Public": 10,
        "Other": 10
    };
 
    //How much you use single use plastics
    const plastic_negatives = {
        "I always use single use items": 15,
        "I use both": 75,
        "I never use single use items": 150
    };
 
    //The amount of energy your household generates/uses
    const energy_negatives = {
        "Low Energy Use": 20,
        "Medium Energy Use": 35,
        "High Energy Use": 70
    };
 
     //How much organic food you buy/eat
    const food_negatives = {
        "Low Organic Food Consumption": 15,
        "Medium Organic Food Consumption": 25,
        "High Organic Food Consumption": 30
    };
 
     //The amount of energy efficient appliances you have (including cars)
    const appliance_negatives = {
        "No energy efficient appliances": 10,
        "Some energy efficient appliances": 30,
        "Only energy efficient appliances": 50
    };
 
 
    //The amount of points you get for doing any amount of these
    const positive_actions_scoring = {
        "Native Plants": 60,
        "Pollinator Garden": 50,
        "Bird Safe": 30,
        "Outdoor Lights Off At Night": 20,
        "Wildlife Volunteering": 40,
        "NONE": 0
    };
 
    //This calculates the bonus points for the positive actions you do
    let positive_bonus = 0;
    if (data.actions) {
        for (let action of data.actions) {
            positive_bonus += positive_actions_scoring[action] || 0;
        }
        //This stops that number so you can only get max 200 pts
        positive_bonus = Math.min(positive_bonus, 200);
    }
 
    //Calculates your total score after adding or subtracting anything
    let score = base_score
        - (habitat_negatives[data.habitat] || 0)
        - (waste_negatives[data.waste] || 0)
        - (chemical_negatives[data.chemicals] || 0)
        - (transport_negatives[data.transport] || 0)
        - (plastic_negatives[data.plastic] || 0)
        - (energy_negatives[data.energy_use] || 0)
        - (appliance_negatives[data.appliances] || 0)
        - (food_negatives[data.food] || 0)
        + positive_bonus;
 
    //Making sure that number is within the limits
    score = Math.max(300, Math.min(score, 850));
    return score;
}
 
/* -------------------- 2. Submitting your form to get recomendations -------------------- */
const form = document.getElementById("wildForm");
if (form) {
    form.addEventListener("submit", function(e) {
        e.preventDefault(); //Making sure your answers are submitted and/or the pg is not reloading
 
        //Making all the input values one object
        const data = {
            habitat: form.Habitat.value,
            waste: form.Waste.value,
            chemicals: form.ChemicalUse.value,
            transport: form.Transportation.value,
            plastic: form.PlasticUse.value,
            energy_use: form.EnergyUse.value,
            appliances: form.Appliances.value,
            food: form.Food.value,
            //All the selections from PositiveWildliveImpact
            actions: Array.from(form.PositiveWildlifeImpact.selectedOptions).map(o => o.value)
        };
 
        //This saves the data into localStorage, ensuring that results.html can acsess it
        localStorage.setItem("wildscoreData", JSON.stringify(data));
 
        //This takes the user to a results page to see their score and feedback
        window.location.href = "results.html";
    });
}
 
/* -------------------- 3. Code to display your results after quiz is completed z -------------------- */
/* -------------------- 3. Displays the score, tier, and recommendations based on your input -------------------- */
const scoreDiv = document.getElementById("score");
 
if (scoreDiv) {
 
    const storedData = JSON.parse(localStorage.getItem("wildscoreData"));
 
    if (storedData) {
 
        //This calculates your score
        const score = calculateWildscore(storedData);
 
        //This displays your score
        scoreDiv.textContent = "Your Wildscore: " + score;
 
        //Displays your tier based on your score
        const tierElement = document.getElementById("tier");
        if (tierElement) {
            tierElement.textContent = "Status Tier: " + getTier(score);
        }
 
        //Gives you recomendations based on your tier
        const recommendationsElement = document.getElementById("recommendations");
        if (recommendationsElement) {
 
            const recommendations = getRecommendations(score);
 
            recommendationsElement.innerHTML = "";
 
            recommendations.forEach(function(rec) {
                const p = document.createElement("p");
                p.textContent = rec;
                recommendationsElement.appendChild(p);
            });
        }
 
    } else {
        scoreDiv.textContent = "No data found. Please fill out the form first.";
    }
}
 
/* -------------------- 4. Code to assign you a tier based on your numerical score -------------------- */
function getTier(score) {
    if (score >= 750) return "No changes needed!";
    else if (score >= 650) return "Great job, here are some few small things to fix!";
    else if (score >= 550) return "Here are a few reccomendations to improve your impact on wildlife:";
    else if (score >= 450) return "Your impact is pretty high, so here are so ways to reduce your impact.";
    else return "Your impact is very high, so here are some urgennt reccomendations to reduce your harm to wildlife.";
}
 
/* -------------------- 4. These are the recommendations given to people based on their tier and numerical score -------------------- */
function getRecommendations(score) {
    if (score >= 750) {
        return [
            "This is very good, keep up the great work!",
            "Consider teaching others about your habits, or implement ever more energy friendly things like solar panels, green energy gas and light bulbs if you don't have them already!"
        ];
    } else if (score >= 650) {
        return [
            "Maybe consider planting more native plants in your garden like; Swamp milkweed, Grass pink orchids and Purple coneflower, just to name a few! (https://www.fws.gov/project/native-plant-list)",
            "Or if none of those, reducing meat consumption slightly, maybe starting with just one plant based meat per week, is an easy way to reduce your harm to wildlife."
        ];
    } else if (score >= 550) {
        return [
            "Use more eco-friendly transportation (bike/walk/public). You can research local public transit in your area!",
            "Reduce chemical use in your yard like pesticides, through methods like mulching, or hand weeding, etc.",
        ];
    } else if (score >= 450) {
        return [
            "Cut down on high meat consumption. There are plenty of delicious plant based recipes you can find on the internet!",
            "Switch to low-impact energy sources, turn lights and water off when you don't use them.",
            "Volunteer with a local wildlife organization, or plant a garden in your own yard with friends or family! (https://www.fws.gov/volunteer-opportunity)"
        ];
    } else {
        return [
            "Your impact is dangerously high, and you are not making the most energy friendly choices, so here are some recommendations to reduce your harm to wildlife.",
            "Maybe you could, adopt a diet that is more plant based. Even just reducing meat consumption by a few meals can help you reduce the threat you pose to wildlife. (https://hsph.harvard.edu/news/this-dietary-pattern-could-save-lives-and-the-planet/)",
            "Try carpooling, biking, or using public transport to reduce your carbon footprint.",
            "Take actions to help wildlife immediately. Plant native plants, turn off outdoor lights at night, and volunteer with local conservation groups. (https://www.fws.gov/story/2021-09/make-your-home-home-wildlife)"
        ];
    }
}