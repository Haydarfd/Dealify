from app import create_app
from flask import render_template

app = create_app('development')

# Import render_template at module level for api_routes
from flask import render_template

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)