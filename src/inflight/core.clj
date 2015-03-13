(ns inflight.core

)
(use 'ring.middleware.content-type)
(use 'ring.adapter.jetty)
(use 'clojure.java.io)

(def pages {
  "/" (fn [] (redirect "/index.html"))
  "/index.html" (fn [] (response (file "resources/index.html")))
})
(defn handler [request]
  (pages (:path request)))

(def app (-> handler
	(wrap-content-type)))

(defn -main 
  "Start jetty use handler"
  [& args]
  (run-jetty app {:port 3000}))
