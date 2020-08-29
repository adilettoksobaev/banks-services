export const randomColor = () => {
    const items = ['#43A047', '#78909C', '#2E7D32', '#0288D1', '#757575', '#A1887F' , '#78909C', '#558B2F', '#1E88E5', '#FF5252'];
    const item = items[Math.floor(Math.random() * items.length)];
    return item;
}