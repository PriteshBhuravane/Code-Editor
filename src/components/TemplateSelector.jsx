import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { FileCode, Palette, Gamepad2 } from "lucide-react";

const TemplateSelector = ({ onTemplateSelect, isDarkMode }) => {
  const templates = [
    {
      id: "blank",
      name: "Blank Template",
      description: "Start with a clean slate",
      icon: FileCode,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blank Template</title>
</head>
<body>
    <h1>Hello World!</h1>
    <p>Start coding here...</p>
</body>
</html>`,
      css: `body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background: #f5f5f5;
}`,
      js: `console.log('Hello World!');`,
    },
    {
      id: "portfolio",
      name: "Portfolio Card",
      description: "Personal portfolio card template",
      icon: Palette,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio Card</title>
</head>
<body>
    <div class="card">
        <div class="avatar">
            <div class="avatar-placeholder">JD</div>
        </div>
        <h2>John Doe</h2>
        <p class="title">Full Stack Developer</p>
        <p class="description">Passionate about creating amazing web experiences with modern technologies.</p>
        <div class="skills">
            <span class="skill">React</span>
            <span class="skill">Node.js</span>
            <span class="skill">TypeScript</span>
        </div>
        <button class="contact-btn" onclick="contact()">Get in Touch</button>
    </div>
</body>
</html>`,
      css: `body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 40px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 40px;
    text-align: center;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    max-width: 350px;
    transform: translateY(0);
    transition: all 0.3s ease;
}

.card:hover {
    transform: translateY(-10px);
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
}

.avatar {
    margin-bottom: 20px;
}

.avatar-placeholder {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 24px;
    font-weight: bold;
    margin: 0 auto;
}

h2 {
    margin: 0 0 5px 0;
    color: #333;
    font-size: 28px;
}

.title {
    color: #666;
    font-size: 16px;
    margin: 0 0 15px 0;
}

.description {
    color: #555;
    line-height: 1.6;
    margin-bottom: 25px;
}

.skills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    margin-bottom: 25px;
}

.skill {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
}

.contact-btn {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border: none;
    color: white;
    padding: 12px 30px;
    border-radius: 25px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.contact-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}`,
      js: `function contact() {
    alert('Thanks for your interest! This is just a demo.');
    console.log('Contact button clicked!');
}

// Add some interactivity
document.addEventListener('DOMContentLoaded', function() {
    const skills = document.querySelectorAll('.skill');
    skills.forEach((skill, index) => {
        skill.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        skill.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
});`,
    },
    {
      id: "game",
      name: "Simple Game",
      description: "Click the moving target game",
      icon: Gamepad2,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Target Game</title>
</head>
<body>
    <div class="game-container">
        <h1>🎯 Target Practice</h1>
        <div class="game-info">
            <div class="score">Score: <span id="score">0</span></div>
            <div class="timer">Time: <span id="timer">30</span>s</div>
        </div>
        <div class="game-area" id="gameArea">
            <div class="target" id="target">🎯</div>
        </div>
        <button class="start-btn" id="startBtn" onclick="startGame()">Start Game</button>
        <div class="instructions">
            Click the moving target as many times as you can in 30 seconds!
        </div>
    </div>
</body>
</html>`,
      css: `body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #ff6b6b, #ffd93d);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.game-container {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    padding: 30px;
    text-align: center;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    width: 100%;
}

h1 {
    margin: 0 0 20px 0;
    color: #333;
    font-size: 2.5em;
}

.game-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: bold;
    color: #555;
}

.game-area {
    position: relative;
    width: 100%;
    height: 300px;
    background: linear-gradient(135deg, #a8edea, #fed6e3);
    border-radius: 15px;
    margin-bottom: 20px;
    overflow: hidden;
    cursor: crosshair;
}

.target {
    position: absolute;
    font-size: 40px;
    cursor: pointer;
    transition: all 0.3s ease;
    user-select: none;
}

.target:hover {
    transform: scale(1.2);
}

.target:active {
    transform: scale(0.8);
}

.start-btn {
    background: linear-gradient(135deg, #ff6b6b, #ffd93d);
    border: none;
    color: white;
    padding: 15px 30px;
    border-radius: 25px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 15px;
}

.start-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(255, 107, 107, 0.3);
}

.start-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.instructions {
    color: #666;
    font-style: italic;
}`,
      js: `let score = 0;
let timeLeft = 30;
let gameRunning = false;
let gameTimer;
let targetTimer;

function startGame() {
    if (gameRunning) return;
    
    gameRunning = true;
    score = 0;
    timeLeft = 30;
    
    document.getElementById('score').textContent = score;
    document.getElementById('timer').textContent = timeLeft;
    document.getElementById('startBtn').textContent = 'Game Running...';
    document.getElementById('startBtn').disabled = true;
    
    // Start the game timer
    gameTimer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft;
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
    
    // Start moving the target
    moveTarget();
}

function moveTarget() {
    if (!gameRunning) return;
    
    const target = document.getElementById('target');
    const gameArea = document.getElementById('gameArea');
    const maxX = gameArea.offsetWidth - 60;
    const maxY = gameArea.offsetHeight - 60;
    
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;
    
    target.style.left = randomX + 'px';
    target.style.top = randomY + 'px';
    
    targetTimer = setTimeout(moveTarget, 1000 + Math.random() * 1000);
}

function endGame() {
    gameRunning = false;
    clearInterval(gameTimer);
    clearTimeout(targetTimer);
    
    document.getElementById('startBtn').textContent = 'Start Game';
    document.getElementById('startBtn').disabled = false;
    
    alert(\`Game Over! Your final score: \${score}\`);
}

// Add click event to target
document.getElementById('target').addEventListener('click', function() {
    if (gameRunning) {
        score++;
        document.getElementById('score').textContent = score;
        
        // Add hit effect
        this.style.transform = 'scale(1.5)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 100);
    }
});`,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={
            isDarkMode
              ? "text-gray-300 hover:text-white hover:bg-white/10"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          }
        >
          <FileCode className="w-4 h-4 mr-2" />
          Templates
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={`w-64 ${
          isDarkMode
            ? "bg-gray-900 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        {templates.map((template) => (
          <DropdownMenuItem
            key={template.id}
            onClick={() => onTemplateSelect(template)}
            className={`cursor-pointer ${
              isDarkMode
                ? "text-gray-300 hover:bg-gray-800 focus:bg-gray-800"
                : "text-gray-700 hover:bg-gray-100 focus:bg-gray-100"
            }`}
          >
            <template.icon className="w-4 h-4 mr-3 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="font-medium">{template.name}</span>
              <span
                className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                {template.description}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TemplateSelector;
