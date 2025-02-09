FROM node:18

WORKDIR /app

# ✅ Install Python & Dependencies
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv

# ✅ Create and Activate Virtual Environment
RUN python3 -m venv /app/venv
RUN /app/venv/bin/pip install --upgrade pip
RUN /app/venv/bin/pip install pydicom pillow numpy

# ✅ Ensure pydicom is installed
RUN /app/venv/bin/python3 -c "import pydicom; print('✅ pydicom installed successfully')"

# ✅ Copy and Install Node.js Dependencies
COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 4000

CMD ["node", "server.js"]
