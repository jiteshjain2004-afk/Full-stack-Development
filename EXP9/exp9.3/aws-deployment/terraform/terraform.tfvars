# Experiment 9.3 — AWS Deployment Configuration
aws_region   = "us-east-1"
project_name = "fullstack-app"
environment  = "production"
vpc_cidr     = "10.0.0.0/16"
app_port     = 8080
task_cpu     = 256
task_memory  = 512
min_capacity = 2   # 2 tasks minimum — one per AZ
max_capacity = 4   # Scale up to 4 tasks under load
