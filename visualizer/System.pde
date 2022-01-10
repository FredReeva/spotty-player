int scale = 30;
float max_speed = 1;
float max_acc = 0.01;
int n_brushes = 40;
int n_particles = 2000;

int N = 30000;
int count;
int th_edge = 200;

class System {
    int type;
    Brush[] brushes;
    Particle[] particles;
    EdgePoint[] edge_points = new EdgePoint[N];

    int rows = floor(height/scale);
    int cols = floor(width/scale);

    Gradient gradient_field; 

    // build a system of objects
    System(int type) {
        this.type = type;
        gradient_field = new Gradient(rows, cols);
        if(type==0) {
            // generate brushes
            brushes = new Brush[n_brushes];
            for(int i=0; i<n_brushes; i++) {
                brushes[i] = new Brush(colors[i%n_colors+1], new PVector(random(width), random(height)));
            }
        }
        if(type==1) {
            // generate particles field
            particles = new Particle[n_particles];
            for(int i=0; i<n_particles; i++) {
                particles[i] = new Particle(colors[i%n_colors+1], new PVector(random(width), random(height)));
            }
        }
        if(type==2) {
            // generate particles image
            for(int i=0;i<N;i++) {
                edge_points[i] = new EdgePoint(colors[i%n_colors+1], int(random(width)),int(random(height)));
            }
        }
    }

    void drawSystem() {
        gradient_field.updateGradients(false);

        if(this.type==0) {
            background( colors[0]);
            for(int i=0; i<n_brushes; i++) {
                brushes[i].wrapEdges();
                brushes[i].followField(gradient_field);
                brushes[i].move();
                brushes[i].show();
            }
        }

        if(this.type==1) {
            for(int i=0; i<n_particles; i++) {
                particles[i].wrapEdges();
                particles[i].followField(gradient_field);
                particles[i].move();
                particles[i].show();
            }
        }

        
        if(this.type==2) {
            if(edgeImg!=null) image(edgeImg, width/2, height/2, width, height);
            loadPixels();
            count = 0;
            for (int i = 0; i < (height); i++) {
                for (int j = 0; j < (width); j++)
                    if(pixels[i*width+j]>color(th_edge) && count<N) {
                    pixels[i*width+j] = color(0,255,0);
                    edge_points[count].assign(j,i);
                    count++;
                }
            }
            updatePixels();
            background( colors[0]);
            for(int i=0; i<count; i++) {
                edge_points[i].show();
                edge_points[i].spring();
            }
        }
  
    }

    void updateColors() {
        if(type==0) {
            for(int i=0; i<n_brushes; i++) {
                brushes[i].changeColor(colors[i%n_colors+1]);
            }
        }
        
        if(type==1) {
            for(int i=0; i<n_particles; i++) {
                particles[i].changeColor(colors[i%n_colors+1]);
            }
        }

        if(type==2) {
            for(int i=0; i<N; i++) {
                edge_points[i].changeColor(colors[i%n_colors+1]);
            }
        }
    
    }

}