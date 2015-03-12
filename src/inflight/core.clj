(ns inflight.core

)

(use 'ring.adapter.jetty)
(defn handler [request]
  { :status 200
    :headers {"Content-Type" "text/html"}
    :body "These are the times that try men's souls."})


(defn -main 
  "Start jetty use handler"
  [& args]
  (run-jetty handler {:port 3000}))
