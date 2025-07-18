const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8080;

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);
    
    // Parse URL and remove query parameters
    let parsedUrl = new URL(req.url, `http://localhost:${port}`);
    let pathname = parsedUrl.pathname;
    
    // Default to index.html for root path
    if (pathname === '/') {
        pathname = '/index.html';
    }
    
    // Construct file path
    const filePath = path.join(__dirname, pathname);
    
    // Get file extension
    const ext = path.parse(filePath).ext;
    
    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // File not found
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html');
            res.end(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>404 - Page Not Found</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            text-align: center;
                            padding: 50px;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            min-height: 100vh;
                            margin: 0;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                        }
                        h1 { font-size: 3rem; margin-bottom: 20px; }
                        p { font-size: 1.2rem; margin-bottom: 30px; }
                        a {
                            color: #fff;
                            text-decoration: none;
                            background: rgba(255,255,255,0.2);
                            padding: 10px 20px;
                            border-radius: 25px;
                            transition: all 0.3s ease;
                        }
                        a:hover {
                            background: rgba(255,255,255,0.3);
                            transform: translateY(-2px);
                        }
                    </style>
                </head>
                <body>
                    <h1>404 🔮</h1>
                    <p>抱歉，您尋找的頁面不存在</p>
                    <a href="/">返回塔羅牌占卜首頁</a>
                </body>
                </html>
            `);
            return;
        }
        
        // Read and serve the file
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Internal Server Error');
                return;
            }
            
            // Set appropriate content type
            const contentType = mimeTypes[ext] || 'application/octet-stream';
            res.setHeader('Content-Type', contentType);
            
            // Add CORS headers for development
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            
            // Add cache control headers
            if (ext === '.html') {
                res.setHeader('Cache-Control', 'no-cache');
            } else {
                res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year for static assets
            }
            
            res.statusCode = 200;
            res.end(data);
        });
    });
});

server.listen(port, () => {
    console.log(`🔮 塔羅牌占卜服務器已啟動`);
    console.log(`📱 請在瀏覽器中訪問: http://localhost:${port}/`);
    console.log(`🌟 按 Ctrl+C 停止服務器`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 正在關閉服務器...');
    server.close(() => {
        console.log('✅ 服務器已安全關閉');
        process.exit(0);
    });
});