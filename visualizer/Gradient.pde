float sp = 0.08;
float tsp = 0.008;
float ioff = 0;
float joff = 0;
float toff = 0;
float angle;

class Gradient {

    PVector[][] gradients; 
    int rows, cols;
    Gradient(int rows, int cols) {
        this.rows = rows;
        this.cols = cols;
        this.gradients = new PVector[this.rows][this.cols];

        for (int i = 0; i < rows; i++) {
            for(int j = 0; j < cols; j++) {
                gradients[i][j] = new PVector();
            }
        }
    }

    PVector getVector (int i, int j) {
        return this.gradients[i][j];
    }

    void updateGradients(boolean showGradients) {
        ioff = 0;
        for (int i = 0; i < rows; i++) {
            joff = 0;
            for(int j = 0; j < cols; j++) {
                angle = map(noise(joff,ioff,toff),0,1,-4*PI,4*PI);
                gradients[i][j] = PVector.fromAngle(angle);

                if(showGradients) {
                    strokeWeight(3);
                    stroke(map(angle,-4*PI,4*PI,100, 255));
                    pushMatrix();
                    translate(j*scale+scale, i*scale+scale);
                    rotate(gradients[i][j].heading());
                    line(0, 0, scale, 0);
                    popMatrix();
                }
                joff += sp;
            }
            ioff += sp;
        }
        toff += tsp;
    }
}