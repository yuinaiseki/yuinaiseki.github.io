function toggleMobileMenu(){
    document.getElementById("menu").classList.toggle("active");
}

function openPopup(itemNumber) {
    const popup = document.getElementById('popup');
    const popupContent = document.getElementById('popup-content');

    const content = {
        1: `
            <h2>MAvis Hospital Robot Simulator</h2>
            <p> This project is a Multi-Agent Visualisation Tool (MAvis) of search-based autonomous robots in a hospital domain. 
            It implements different search algorithms and heuristics to compare and observe the behavior of the robots in various hospital environments.</p>
            <img src="./imgs/mavis.png" alt="MAvis">
            <a href="https://github.com/yuinaiseki/MAvis" target="_blank" class = "button green">  GitHub link </a>
        `,
        2: `
            <h2>Poisson Image Editing</h2>
            <p> This Computer Vision project is a tool that enables seamless and automatic image blending.
            This technique was originally conceived by Perez et al. from Microsoft Research UK. </p>
            <img src="./imgs/poisson.png" alt="Poisson Image Editing">
            <a href="https://github.com/yuinaiseki/PoissonCloning" target="_blank" class = "button green">  GitHub link </a>
            <a href="./Yuina_PoissonImageEditing.pdf" target="_blank" class = "button green">  Paper link </a>
        `,
        3: `
        <h2>Observing Cascading Failure Effect in Network Systems through the Prisoner Dilemma Game (PDG) </h2>
        <p> This projeect examines the effects of the lack of commitment and its impact on cascading failures within real-world social and economic network systems.
        Specifically, we investigate how defection and cooperation behaviors in a networked Prisoner's Dilemma Game (PDG) influence cascading failure behavior, potentially leading to large-scale network collapse.  </p>
        <img src="./gifs/networks.gif" alt="Networks">
        <a href="https://github.com/yuinaiseki/Networks" target="_blank" class = "button green">  GitHub link </a>
        <a href="./Yuina_PoissonImageEditing.pdf" target="_blank" class = "button green">  Paper link </a>
        `,
        4: `
        <h2>Slime Alchemist</h2>
        <p> "The Slime Alchemist" is an educational 2D platformer game for children and adults to learn about chemical reactions. 
        Each chemical is a cute slime, and the player tries to meet with other chemical slimes to create chemical compounds and unlock levels. 
        The BGM, UI, and sound effects aim to create a bubbly and fun experience for the player. </p>
        <img src="./gifs/slime-alchemist.gif" alt="Slime Alchemist">
        <a href="https://github.com/yuinaiseki/SlimeAlchemist" target="_blank" class = "button green">  GitHub link </a>
        `,
        5: `
        <h2>Scarlet's Shadow</h2>
        <p> "Scarlet's Shadow" is a horror-aesthetic game themed on personal growth, decision-making, and moral good. 
        The game is inspired by the fairytale "The Little Red Riding Hood", and like the original tale, the player's objective is to navigate the forest and safely get to grandma's house with some goods.
        Unknowingly the player is in a dream state, and the narrative of the game focuses on overcoming the inner darkness held within the player. 
        The main enemy and the narrator are both internal parts of the player, which the player will piece together clues to find out as the game progresses.
        There are two main outcomes to the story: either the player will be enveloped by darkness (their loss of hope and loneliness, resulting in death) OR the player will find a way to bring light to the land and wake up from the dream. </p>
        <img src="./gifs/red-ridinghood.gif" alt="Scarlet's Shadow">
        <a href="https://github.com/yuinaiseki/RedRidinghood" target="_blank" class = "button green">  GitHub link </a>
    `};


    // Set the popup content
    popupContent.innerHTML = content[itemNumber] || "No content available.";
    popup.style.display = 'flex';
}
  
function closePopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'none';
}