// Add this function to update header stats
function updateHeaderStats() {
    const totalLinks = allLinks.length;
    const totalClicks = allLinks.reduce((sum, link) => sum + link.total_clicks, 0);
    document.getElementById('totalLinks').textContent = totalLinks;
    document.getElementById('totalClicks').textContent = totalClicks;
}

// Call it after loading links
loadLinks().then(() => {
    updateHeaderStats();
});