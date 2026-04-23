import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.awt.geom.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class WellnessQuest extends JFrame {
    public WellnessQuest() {
        setTitle("Wellness Quest - Recovery Journey");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setResizable(false);
        GamePanel gamePanel = new GamePanel();
        add(gamePanel);
        pack();
        setLocationRelativeTo(null);
        setVisible(true);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new WellnessQuest());
    }
}

class GamePanel extends JPanel implements KeyListener, ActionListener {
    private static final int WIDTH = 1000;
    private static final int HEIGHT = 700;
    private static final int TILE_SIZE = 40;
    
    private GameState currentState;
    private Player player;
    private List<NPC> npcs;
    private List<Quest> quests;
    private List<Item> items;
    private int currentLevel;
    private Random random;
    private Timer gameTimer;
    
    private enum GameState {
        MENU, PLAYING, QUEST_COMPLETE, GAME_WON
    }
    
    public GamePanel() {
        setPreferredSize(new Dimension(WIDTH, HEIGHT));
        setBackground(new Color(240, 248, 255));
        setFocusable(true);
        addKeyListener(this);
        
        random = new Random();
        player = new Player();
        npcs = new ArrayList<>();
        quests = new ArrayList<>();
        items = new ArrayList<>();
        currentState = GameState.MENU;
        currentLevel = 1;
        
        gameTimer = new Timer(50, this);
        gameTimer.start();
        
        initializeLevel();
    }
    
    private void initializeLevel() {
        npcs.clear();
        quests.clear();
        items.clear();
        
        // Create NPCs with quests
        npcs.add(new NPC("Doc Maya", 200, 150, "Complete a 15-minute meditation session"));
        npcs.add(new NPC("Coach Alex", 600, 150, "Do 20 minutes of exercise today"));
        npcs.add(new NPC("Friend Jordan", 200, 500, "Call a friend or family member"));
        npcs.add(new NPC("Sage Riley", 600, 500, "Journal about your feelings for 10 minutes"));
        
        // Create quests for each NPC
        quests.add(new Quest("Mindfulness Meditation", "Meditate for 15 minutes", 25));
        quests.add(new Quest("Physical Exercise", "Exercise for 20 minutes", 25));
        quests.add(new Quest("Social Connection", "Connect with someone supportive", 25));
        quests.add(new Quest("Self Reflection", "Journal your thoughts and feelings", 25));
        
        // Create wellness items scattered around
        items.add(new Item(350, 250, "Water Bottle", 10));
        items.add(new Item(750, 350, "Meditation Stone", 15));
        items.add(new Item(450, 450, "Journal", 15));
        items.add(new Item(300, 600, "Healthy Snack", 10));
    }
    
    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2d = (Graphics2D) g;
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        
        switch (currentState) {
            case MENU:
                drawMenu(g2d);
                break;
            case PLAYING:
                drawGame(g2d);
                break;
            case QUEST_COMPLETE:
                drawQuestComplete(g2d);
                break;
            case GAME_WON:
                drawGameWon(g2d);
                break;
        }
    }
    
    private void drawMenu(Graphics2D g) {
        g.setColor(new Color(70, 130, 180));
        g.fillRect(0, 0, WIDTH, HEIGHT);
        
        g.setColor(Color.WHITE);
        g.setFont(new Font("Arial", Font.BOLD, 60));
        g.drawString("WELLNESS QUEST", 150, 150);
        
        g.setFont(new Font("Arial", Font.PLAIN, 24));
        g.drawString("A Recovery Journey RPG", 300, 220);
        
        g.setFont(new Font("Arial", Font.PLAIN, 20));
        g.drawString("Embark on a quest to improve your wellness through", 150, 300);
        g.drawString("positive choices and meaningful activities.", 150, 330);
        
        g.setFont(new Font("Arial", Font.BOLD, 24));
        g.drawString("PRESS SPACE TO START", 300, 450);
        
        g.setFont(new Font("Arial", Font.PLAIN, 16));
        g.drawString("Controls: Arrow Keys to move, SPACE to interact", 200, 550);
        g.drawString("Goal: Complete all quests and reach 100 wellness!", 200, 580);
    }
    
    private void drawGame(Graphics2D g) {
        // Draw background
        g.setColor(new Color(220, 237, 200));
        g.fillRect(0, 0, WIDTH, HEIGHT);
        
        // Draw grass tiles
        g.setColor(new Color(144, 238, 144));
        for (int x = 0; x < WIDTH; x += TILE_SIZE * 2) {
            for (int y = 0; y < HEIGHT; y += TILE_SIZE * 2) {
                g.drawRect(x, y, TILE_SIZE, TILE_SIZE);
            }
        }
        
        // Draw items
        for (Item item : items) {
            item.draw(g);
        }
        
        // Draw NPCs
        for (NPC npc : npcs) {
            npc.draw(g);
        }
        
        // Draw player
        player.draw(g);
        
        // Draw HUD
        drawHUD(g);
    }
    
    private void drawHUD(Graphics2D g) {
        g.setColor(new Color(50, 50, 50, 200));
        g.fillRect(0, 0, WIDTH, 80);
        
        g.setColor(Color.WHITE);
        g.setFont(new Font("Arial", Font.BOLD, 18));
        g.drawString("Level: " + currentLevel, 20, 30);
        g.drawString("Wellness: " + player.wellnessLevel + "/100", 20, 55);
        
        g.drawString("Quests Completed: " + player.questsCompleted + "/4", 400, 30);
        g.drawString("Items Collected: " + player.itemsCollected, 400, 55);
    }
    
    private void drawQuestComplete(Graphics2D g) {
        drawGame(g);
        
        g.setColor(new Color(0, 0, 0, 150));
        g.fillRect(0, 0, WIDTH, HEIGHT);
        
        g.setColor(new Color(255, 215, 0));
        g.setFont(new Font("Arial", Font.BOLD, 50));
        g.drawString("QUEST COMPLETED!", 200, 250);
        
        g.setColor(Color.WHITE);
        g.setFont(new Font("Arial", Font.PLAIN, 24));
        g.drawString("Great work on your wellness journey!", 250, 320);
        g.drawString("PRESS SPACE to continue", 300, 400);
    }
    
    private void drawGameWon(Graphics2D g) {
        g.setColor(new Color(34, 139, 34));
        g.fillRect(0, 0, WIDTH, HEIGHT);
        
        g.setColor(new Color(255, 215, 0));
        g.setFont(new Font("Arial", Font.BOLD, 60));
        g.drawString("YOU'VE WON!", 250, 200);
        
        g.setColor(Color.WHITE);
        g.setFont(new Font("Arial", Font.PLAIN, 28));
        g.drawString("Congratulations on your wellness achievement!", 150, 300);
        g.drawString("You've completed all quests and reached 100 wellness!", 100, 350);
        g.drawString("Your recovery journey continues...", 250, 450);
        
        g.setFont(new Font("Arial", Font.BOLD, 24));
        g.drawString("PRESS SPACE to return to menu", 280, 550);
    }
    
    @Override
    public void actionPerformed(ActionEvent e) {
        if (currentState == GameState.PLAYING) {
            // Check collisions with items
            for (Item item : items) {
                if (player.getBounds().intersects(item.getBounds())) {
                    player.itemsCollected++;
                    player.wellnessLevel = Math.min(100, player.wellnessLevel + item.wellnessBonus);
                    items.remove(item);
                    break;
                }
            }
            
            // Check collisions with NPCs and quests
            for (int i = 0; i < npcs.size(); i++) {
                NPC npc = npcs.get(i);
                if (player.getBounds().intersects(npc.getBounds())) {
                    player.questsCompleted++;
                    player.wellnessLevel = Math.min(100, player.wellnessLevel + 15);
                    npcs.remove(i);
                    quests.remove(i);
                    break;
                }
            }
            
            // Check win condition
            if (player.wellnessLevel >= 100) {
                currentState = GameState.GAME_WON;
            }
        }
        repaint();
    }
    
    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_SPACE) {
            if (currentState == GameState.MENU) {
                currentState = GameState.PLAYING;
            } else if (currentState == GameState.GAME_WON) {
                currentState = GameState.MENU;
                player = new Player();
                currentLevel = 1;
                initializeLevel();
            }
        }
        
        if (currentState == GameState.PLAYING) {
            switch (e.getKeyCode()) {
                case KeyEvent.VK_UP:
                    player.y = Math.max(80, player.y - 20);
                    break;
                case KeyEvent.VK_DOWN:
                    player.y = Math.min(HEIGHT - 40, player.y + 20);
                    break;
                case KeyEvent.VK_LEFT:
                    player.x = Math.max(0, player.x - 20);
                    break;
                case KeyEvent.VK_RIGHT:
                    player.x = Math.min(WIDTH - 40, player.x + 20);
                    break;
            }
        }
    }
    
    @Override
    public void keyReleased(KeyEvent e) {}
    
    @Override
    public void keyTyped(KeyEvent e) {}
}

class Player {
    int x = 450, y = 600;
    int wellnessLevel = 40;
    int questsCompleted = 0;
    int itemsCollected = 0;
    
    public void draw(Graphics2D g) {
        g.setColor(new Color(0, 102, 204));
        g.fillOval(x, y, 40, 40);
        g.setColor(Color.WHITE);
        g.drawOval(x, y, 40, 40);
        g.setStroke(new BasicStroke(2));
    }
    
    public Rectangle getBounds() {
        return new Rectangle(x, y, 40, 40);
    }
}

class NPC {
    String name;
    int x, y;
    String questDescription;
    
    public NPC(String name, int x, int y, String questDescription) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.questDescription = questDescription;
    }
    
    public void draw(Graphics2D g) {
        g.setColor(new Color(220, 20, 60));
        g.fillRect(x, y, 50, 50);
        g.setColor(Color.WHITE);
        g.setFont(new Font("Arial", Font.BOLD, 12));
        g.drawString(name, x + 5, y + 65);
    }
    
    public Rectangle getBounds() {
        return new Rectangle(x, y, 50, 50);
    }
}

class Quest {
    String title;
    String description;
    int wellnessReward;
    
    public Quest(String title, String description, int wellnessReward) {
        this.title = title;
        this.description = description;
        this.wellnessReward = wellnessReward;
    }
}

class Item {
    int x, y;
    String name;
    int wellnessBonus;
    int size = 20;
    
    public Item(int x, int y, String name, int wellnessBonus) {
        this.x = x;
        this.y = y;
        this.name = name;
        this.wellnessBonus = wellnessBonus;
    }
    
    public void draw(Graphics2D g) {
        g.setColor(new Color(255, 200, 0));
        g.fillRect(x, y, size, size);
        g.setColor(Color.BLACK);
        g.setStroke(new BasicStroke(2));
        g.drawRect(x, y, size, size);
        g.setFont(new Font("Arial", Font.BOLD, 10));
        g.drawString(name.substring(0, 1), x + 6, y + 15);
    }
    
    public Rectangle getBounds() {
        return new Rectangle(x, y, size, size);
    }
}