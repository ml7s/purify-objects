// استيراد المكتبة
const cleanObject = require('purify-objects');

// الكائن المتسخ (المليء بالقيم الفارغة)
const dirtyObject = {
  name: "Turki",
  age: null,
  address: {
    city: "Riyadh",
    street: "",
    zip: undefined,
  },
  tags: [],
};

// تنظيف الكائن
const cleaned = cleanObject(dirtyObject);

// النتيجة بعد التنظيف
console.log(cleaned);
// النتيجة: { name: "Turki", address: { city: "Riyadh" } }
