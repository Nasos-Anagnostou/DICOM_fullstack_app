FROM node:18

WORKDIR /app

# Install Python and venv
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv

# Create a Python virtual environment
RUN python3 -m venv /app/venv

# Activate venv and install pydicom
RUN /app/venv/bin/pip install pydicom

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 4000

CMD ["node", "server.js"]
