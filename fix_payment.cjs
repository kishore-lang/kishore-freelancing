const fs = require('fs');
let c = fs.readFileSync('server/controllers/paymentController.js', 'utf8');

c = c.replace('// Trigger Telegram Alert', 'try {\n            const io = req.app.get("io");\n            if (io) {\n              io.emit("new_payment", {\n                orderId: razorpay_order_id,\n                amount: amountPaise ? amountPaise / 100 : 0,\n                customerName: customerDetails?.full_name || "Customer",\n                serviceName: customerDetails?.service_name || "Freelance Service"\n              });\n            }\n          } catch (err) {\n            console.error("Socket emit error:", err);\n          }\n\n          // Trigger Telegram Alert');

fs.writeFileSync('server/controllers/paymentController.js', c);
