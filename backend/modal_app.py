import modal

image = (
    modal.Image.debian_slim(python_version="3.12")
    .pip_install_from_requirements("requirements.txt")
    .env({"PYTHONPATH": "/root"})
    .add_local_file("api.py", "/root/api.py")
    .add_local_dir("src", "/root/src")
)

app = modal.App("afya-buddy-backend", image=image)

@app.function(
    secrets=[modal.Secret.from_name("afyabuddy-secrets")],
    min_containers=1,
    max_containers=2,
    scaledown_window=600,
    timeout=300,
)
@modal.concurrent(max_inputs=20)
@modal.wsgi_app()
def web():
    from api import app as flask_app
    return flask_app